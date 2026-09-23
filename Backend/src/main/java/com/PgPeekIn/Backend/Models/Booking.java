package com.PgPeekIn.Backend.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "booking")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "allocation_id", nullable = false)
    private Long allocationId;

    @Column(name = "booking_status", nullable = false)
    private String bookingStatus;

    @Column(name = "booking_date", nullable = false)
    private OffsetDateTime bookingDate;
}