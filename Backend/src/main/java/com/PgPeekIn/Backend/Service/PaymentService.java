package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.Payment;
import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Payment createPayment(Payment payment) {

        // Set payment date automatically
        payment.setPaymentDate(LocalDateTime.now());

        // Save payment
        Payment savedPayment = paymentRepository.save(payment);

        // If payment is successful
        if ("paid".equalsIgnoreCase(savedPayment.getStatus())) {

            // Find the related booking
            Booking booking = bookingRepository
                    .findById(savedPayment.getBookingId())
                    .orElseThrow(() ->
                            new RuntimeException("Booking not found"));

            // Change booking status
            booking.setBookingStatus("confirmed");

            // Save updated booking
            bookingRepository.save(booking);
        }

        return savedPayment;
    }

    // Get payment history for a booking
    public List<Payment> getPaymentsByBookingId(Long bookingId) {

        return paymentRepository
                .findByBookingIdOrderByPaymentDateDesc(bookingId);
    }
}