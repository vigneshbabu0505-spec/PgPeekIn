package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.OwnerBookingDTO;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/owner/bookings")
public class OwnerBookingController {

    private final BookingService bookingService;
    private final AuthRepository authRepository;

    public OwnerBookingController(
            BookingService bookingService,
            AuthRepository authRepository) {

        this.bookingService = bookingService;
        this.authRepository = authRepository;
    }


    // =========================================================
    // GET ALL BOOKINGS FOR OWNER
    // =========================================================

    @GetMapping
    public ResponseEntity<List<OwnerBookingDTO>> getOwnerBookings(
            Authentication authentication) {

        String email = authentication.getName();

        User owner = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Owner not found"));

        List<OwnerBookingDTO> bookings =
                bookingService.getOwnerBookings(owner.getId());

        return ResponseEntity.ok(bookings);
    }


    // =========================================================
    // GET SINGLE BOOKING DETAILS
    // =========================================================

    @GetMapping("/{bookingId}")
    public ResponseEntity<OwnerBookingDTO> getOwnerBookingDetails(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String email = authentication.getName();

        User owner = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Owner not found"));

        OwnerBookingDTO booking =
                bookingService.getOwnerBookingDetails(
                        owner.getId(),
                        bookingId
                );

        return ResponseEntity.ok(booking);
    }
}