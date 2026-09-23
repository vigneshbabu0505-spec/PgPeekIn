package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Models.Slot;
import com.PgPeekIn.Backend.Models.SlotAllocation;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.RoomRepository;
import com.PgPeekIn.Backend.Repository.SlotAllocationRepository;
import com.PgPeekIn.Backend.Repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner/tenants")
public class OwnerTenantController {

    private final AuthRepository authRepository;
    private final PgRepo pgRepo;
    private final BookingRepository bookingRepository;
    private final SlotAllocationRepository slotAllocationRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    @GetMapping
    public ResponseEntity<?> getOwnerTenants(Authentication authentication) {

        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized");
            }

            String email = authentication.getName();

            User owner = authRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Owner not found"));

            if (owner.getRole() == null ||
                    !"owner".equalsIgnoreCase(owner.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only owners can view tenants");
            }

            // Get the PG owned by the logged-in owner.
            List<PgModel> ownerPgs = pgRepo.findAllByUserid(owner.getId());

            if (ownerPgs == null || ownerPgs.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }

            // This application currently allows an owner to manage a PG
            // from the My PGs page. Include bookings from all PGs owned
            // by this user so the endpoint remains correct if more PGs
            // are added later.
            List<Long> ownerPgIds = ownerPgs.stream()
                    .map(PgModel::getPgid)
                    .toList();

            Map<Long, PgModel> pgMap = new HashMap<>();
            for (PgModel pg : ownerPgs) {
                pgMap.put(pg.getPgid(), pg);
            }

            List<Booking> bookings =
                    bookingRepository.findAllByOrderByBookingDateDesc();

            List<Map<String, Object>> result = new ArrayList<>();

            for (Booking booking : bookings) {

                // Cancelled bookings should not appear as current tenants.
                if ("cancelled".equalsIgnoreCase(
                        booking.getBookingStatus())) {
                    continue;
                }

                SlotAllocation allocation =
                        slotAllocationRepository
                                .findById(booking.getAllocationId())
                                .orElse(null);

                if (allocation == null) {
                    continue;
                }

                Slot slot =
                        slotRepository
                                .findById(allocation.getSlotId())
                                .orElse(null);

                if (slot == null) {
                    continue;
                }

                Room room =
                        roomRepository
                                .findById(slot.getRoomId())
                                .orElse(null);

                if (room == null) {
                    continue;
                }

                PgModel pg = pgMap.get(room.getPgId());

                // This is the important owner filter:
                // only bookings whose room belongs to this owner's PG.
                if (pg == null || !ownerPgIds.contains(pg.getPgid())) {
                    continue;
                }

                User tenant =
                        authRepository
                                .findById(booking.getUserId())
                                .orElse(null);

                if (tenant == null) {
                    continue;
                }

                String status =
                        calculateDisplayStatus(
                                booking.getBookingStatus(),
                                allocation.getCheckinDate(),
                                allocation.getCheckoutDate()
                        );

                Map<String, Object> item = new HashMap<>();

                item.put("id", tenant.getId());
                item.put("name", tenant.getUser_name());
                item.put("phone", tenant.getUser_phone());

                item.put("bookingId", booking.getBookingId());

                item.put("pg", pg.getPgname());
                item.put("pgId", pg.getPgid());

                item.put(
                        "room",
                        "Room " + room.getRoomNo()
                );

                item.put("roomId", room.getRoomId());
                item.put("slotNo", slot.getSlotNo());

                item.put(
                        "checkIn",
                        allocation.getCheckinDate()
                                .format(DATE_FORMAT)
                );

                item.put(
                        "checkOut",
                        allocation.getCheckoutDate()
                                .format(DATE_FORMAT)
                );

                item.put("status", status);

                item.put(
                        "bookingStatus",
                        booking.getBookingStatus()
                );

                result.add(item);
            }

            // Latest bookings first.
            result.sort(
                    Comparator.comparing(
                            item -> (Long) item.get("bookingId"),
                            Comparator.reverseOrder()
                    )
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch tenants: " + e.getMessage());
        }
    }

    private String calculateDisplayStatus(
            String bookingStatus,
            LocalDate checkIn,
            LocalDate checkOut) {

        if ("completed".equalsIgnoreCase(bookingStatus)) {
            return "Completed";
        }

        if ("confirmed".equalsIgnoreCase(bookingStatus)) {

            LocalDate today = LocalDate.now();

            if (!today.isBefore(checkIn) && today.isBefore(checkOut)) {
                return "Active";
            }

            if (today.isBefore(checkIn)) {
                return "Upcoming";
            }

            return "Completed";
        }

        // Pending booking is not yet an active stay.
        if ("pending".equalsIgnoreCase(bookingStatus)) {
            return "Upcoming";
        }

        // Safe fallback for any other booking status.
        return "Upcoming";
    }
}
