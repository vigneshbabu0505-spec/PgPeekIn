package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.*;
import com.PgPeekIn.Backend.Repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class OwnerDashboardService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private PgRepo pgRepo;

    @Autowired
    private RoomRepository roomRepo;

    @Autowired
    private SlotRepository slotRepo;

    @Autowired
    private SlotAllocationRepository allocationRepo;

    @Autowired
    private BookingRepository bookingRepo;


    public OwnerDashboardResponse getDashboard(String ownerEmail) {

        // ----------------------------------------
        // 1. Find logged-in owner
        // ----------------------------------------

        User owner = authRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Owner not found")
                );

        Long ownerId = owner.getId();


        // ----------------------------------------
        // 2. Get owner's PGs
        // ----------------------------------------

        List<PgModel> pgs =
                pgRepo.findAllByUserid(ownerId);

        long totalPgs = pgs.size();


        // ----------------------------------------
        // 3. Get owner's rooms
        // ----------------------------------------

        List<Long> pgIds = new ArrayList<>();

        for (PgModel pg : pgs) {
            pgIds.add(pg.getPgid());
        }

        List<Room> rooms = new ArrayList<>();

        if (!pgIds.isEmpty()) {
            rooms = roomRepo.findAllByPgIdIn(pgIds);
        }

        long totalRooms = rooms.size();


        // ----------------------------------------
        // 4. Get all slots
        // ----------------------------------------

        List<Slot> slots = new ArrayList<>();

        for (Room room : rooms) {

            List<Slot> roomSlots =
                    slotRepo.findByRoomId(room.getRoomId());

            slots.addAll(roomSlots);
        }

        long totalSlots = slots.size();


        // ----------------------------------------
        // 5. Calculate currently occupied slots
        // ----------------------------------------

        LocalDate today = LocalDate.now();

        long occupiedSlots = 0;

        Set<Long> occupiedSlotIds = new HashSet<>();

        for (Slot slot : slots) {

            List<SlotAllocation> allocations =
                    allocationRepo.findBySlotId(
                            slot.getSlotId()
                    );

            for (SlotAllocation allocation : allocations) {

                boolean activeStatus =
                        "reserved".equalsIgnoreCase(
                                allocation.getStatus()
                        )
                                ||
                                "occupied".equalsIgnoreCase(
                                        allocation.getStatus()
                                );

                boolean activeDate =
                        !today.isBefore(
                                allocation.getCheckinDate()
                        )
                                &&
                                today.isBefore(
                                        allocation.getCheckoutDate()
                                );

                if (activeStatus && activeDate) {

                    if (!occupiedSlotIds.contains(
                            slot.getSlotId()
                    )) {

                        occupiedSlotIds.add(
                                slot.getSlotId()
                        );

                        occupiedSlots++;
                    }
                }
            }
        }


        // ----------------------------------------
        // 6. Available slots
        // ----------------------------------------

        long availableSlots =
                totalSlots - occupiedSlots;

        if (availableSlots < 0) {
            availableSlots = 0;
        }


        // ----------------------------------------
        // 7. Get owner's bookings
        // ----------------------------------------

        List<Booking> allBookings =
                bookingRepo.findAllByOrderByBookingDateDesc();


        // ----------------------------------------
        // 8. Keep only bookings belonging
        //    to owner's slots
        // ----------------------------------------

        Set<Long> ownerSlotIds = new HashSet<>();

        for (Slot slot : slots) {
            ownerSlotIds.add(slot.getSlotId());
        }

        List<Booking> ownerBookings =
                new ArrayList<>();

        for (Booking booking : allBookings) {

            Optional<SlotAllocation> allocation =
                    allocationRepo.findById(
                            booking.getAllocationId()
                    );

            if (allocation.isPresent()) {

                Long slotId =
                        allocation.get().getSlotId();

                if (ownerSlotIds.contains(slotId)) {
                    ownerBookings.add(booking);
                }
            }
        }


        // ----------------------------------------
        // 9. Booking trends
        // ----------------------------------------

        List<OwnerDashboardResponse.BookingTrend>
                bookingTrends =
                getLastSixMonths(ownerBookings);


        // ----------------------------------------
        // 10. Recent bookings
        // ----------------------------------------

        List<OwnerDashboardResponse.RecentBooking>
                recentBookings =
                new ArrayList<>();

        int count = 0;

        for (Booking booking : ownerBookings) {

            if (count >= 5) {
                break;
            }

            Optional<SlotAllocation> allocationOptional =
                    allocationRepo.findById(
                            booking.getAllocationId()
                    );

            if (allocationOptional.isEmpty()) {
                continue;
            }

            SlotAllocation allocation =
                    allocationOptional.get();

            Optional<Slot> slotOptional =
                    slotRepo.findById(
                            allocation.getSlotId()
                    );

            if (slotOptional.isEmpty()) {
                continue;
            }

            Slot slot = slotOptional.get();

            Optional<Room> roomOptional =
                    roomRepo.findById(
                            slot.getRoomId()
                    );

            if (roomOptional.isEmpty()) {
                continue;
            }

            Room room = roomOptional.get();

            Optional<PgModel> pgOptional =
                    pgRepo.findById(
                            room.getPgId()
                    );

            if (pgOptional.isEmpty()) {
                continue;
            }

            PgModel pg = pgOptional.get();


            // Find tenant
            Optional<User> tenantOptional =
                    authRepository.findById(
                            booking.getUserId()
                    );

            String tenantName = "Unknown";

            if (tenantOptional.isPresent()) {
                tenantName =
                        tenantName = tenantOptional.get().getUser_name();
            }


            recentBookings.add(
                    new OwnerDashboardResponse.RecentBooking(
                            tenantName,
                            pg.getPgname(),
                            room.getRoomNo(),
                            booking.getBookingStatus()
                    )
            );

            count++;
        }


        // ----------------------------------------
        // 11. Return dashboard response
        // ----------------------------------------

        return new OwnerDashboardResponse(
                totalPgs,
                totalRooms,
                availableSlots,
                occupiedSlots,
                bookingTrends,
                recentBookings
        );
    }


    // =====================================================
    // LAST 6 MONTHS BOOKING TREND
    // =====================================================

    private List<OwnerDashboardResponse.BookingTrend>
    getLastSixMonths(List<Booking> bookings) {

        List<OwnerDashboardResponse.BookingTrend>
                result = new ArrayList<>();

        LocalDate currentDate =
                LocalDate.now();

        for (int i = 5; i >= 0; i--) {

            LocalDate date =
                    currentDate.minusMonths(i);

            int month =
                    date.getMonthValue();

            int year =
                    date.getYear();

            long count = 0;

            for (Booking booking : bookings) {

                OffsetDateTime bookingDate =
                        booking.getBookingDate();

                if (bookingDate.getMonthValue() == month
                        && bookingDate.getYear() == year) {

                    count++;
                }
            }

            String monthName =
                    date.getMonth()
                            .getDisplayName(
                                    TextStyle.SHORT,
                                    Locale.ENGLISH
                            );

            result.add(
                    new OwnerDashboardResponse.BookingTrend(
                            monthName,
                            count
                    )
            );
        }

        return result;
    }
}