package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Models.Slot;
import com.PgPeekIn.Backend.Models.SlotAllocation;
import com.PgPeekIn.Backend.Models.User;

import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Repository.RoomRepository;
import com.PgPeekIn.Backend.Repository.SlotAllocationRepository;
import com.PgPeekIn.Backend.Repository.SlotRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tenant/reviews")
public class TenantReviewBookingController {

    private final BookingRepository bookingRepository;
    private final SlotAllocationRepository slotAllocationRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;
    private final AuthRepository authRepository;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingReviewInfo(
            @PathVariable Long bookingId,
            Authentication authentication) {

        // Get logged-in user
        String email = authentication.getName();

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Get booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Security check:
        // booking must belong to logged-in tenant
        if (!booking.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403)
                    .body("You cannot review this booking.");
        }

        // Only confirmed bookings can be reviewed
        if (!"confirmed".equalsIgnoreCase(
                booking.getBookingStatus())) {

            return ResponseEntity.badRequest()
                    .body("Only confirmed bookings can be reviewed.");
        }

        // Get allocation
        SlotAllocation allocation =
                slotAllocationRepository
                        .findById(booking.getAllocationId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Slot allocation not found"));

        // Get slot
        Slot slot =
                slotRepository.findById(allocation.getSlotId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Slot not found"));

        // Get room
        Room room =
                roomRepository.findById(slot.getRoomId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Room not found"));

        // PG ID
        Long pgId = room.getPgId();

        return ResponseEntity.ok(
                Map.of(
                        "bookingId", booking.getBookingId(),
                        "pgId", pgId,
                        "bookingStatus",
                        booking.getBookingStatus()
                )
        );
    }
}