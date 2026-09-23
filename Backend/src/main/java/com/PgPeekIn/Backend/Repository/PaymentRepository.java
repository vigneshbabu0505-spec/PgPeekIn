package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingIdOrderByPaymentDateDesc(Long bookingId);

}