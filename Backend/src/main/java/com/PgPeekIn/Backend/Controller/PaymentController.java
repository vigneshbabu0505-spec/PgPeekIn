package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.Payment;
import com.PgPeekIn.Backend.Service.PaymentService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/PgPeekIn/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // ==========================================
    // CREATE PAYMENT
    // ==========================================

    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @RequestBody Payment payment) {

        Payment savedPayment =
                paymentService.createPayment(payment);

        return new ResponseEntity<>(
                savedPayment,
                HttpStatus.CREATED
        );
    }

    // ==========================================
    // GET PAYMENTS FOR BOOKING
    // ==========================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBookingId(
            @PathVariable Long bookingId) {

        List<Payment> payments =
                paymentService.getPaymentsByBookingId(
                        bookingId
                );

        return ResponseEntity.ok(payments);
    }
}