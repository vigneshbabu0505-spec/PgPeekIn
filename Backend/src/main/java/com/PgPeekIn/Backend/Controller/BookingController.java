package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.BookingRequest;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Service.BookingService;
import com.PgPeekIn.Backend.Models.BookingDashboardDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final AuthRepository authRepository;

    public BookingController(
            BookingService bookingService,
            AuthRepository authRepository) {

        this.bookingService = bookingService;
        this.authRepository = authRepository;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {

        // Get email from JWT
        String email = authentication.getName();
        System.out.println("AUTHENTICATED USER = " + email);

        // Find logged-in user
        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Get actual user_id from database
        Long userId = user.getId();

        // Create booking + allocation
        Booking booking = bookingService.createBooking(
                userId,
                request.getRoomId(),
                request.getCheckinDate(),
                request.getCheckoutDate()
        );

        return new ResponseEntity<>(
                booking,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
        Authentication authentication) {
            String email = authentication.getName();
            User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                       new RuntimeException("User not found"));
            Long userId = user.getId();
            List<Booking> bookings = bookingService.getMyBookings(userId);
            return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(
        @PathVariable Long bookingId) {
            Booking booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(booking);
    }

    @GetMapping("/my/dashboard")
    public ResponseEntity<BookingDashboardDTO> getMyDashboardBooking(
            Authentication authentication) {

        String email = authentication.getName();

        User user = authRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Long userId = user.getId();

        BookingDashboardDTO dashboardBooking =
                bookingService.getMyDashboardBooking(userId);

        return ResponseEntity.ok(dashboardBooking);
    }
}