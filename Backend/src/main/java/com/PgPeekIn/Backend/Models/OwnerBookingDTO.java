package com.PgPeekIn.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerBookingDTO {

    // =========================
    // BOOKING INFORMATION
    // =========================

    private Long bookingId;

    private OffsetDateTime bookingDate;

    private String bookingStatus;


    // =========================
    // TENANT INFORMATION
    // =========================

    private Long tenantId;

    private String tenantName;

    private String tenantEmail;

    private String tenantPhone;


    // =========================
    // PG INFORMATION
    // =========================

    private Long pgId;

    private String pgName;

    private String pgType;

    private String pgArea;

    private String pgCity;


    // =========================
    // ROOM INFORMATION
    // =========================

    private Long roomId;

    private String roomNo;

    private String roomCategory;

    private Integer sharingType;

    private BigDecimal monthlyRent;

    private BigDecimal dailyRent;


    // =========================
    // SLOT INFORMATION
    // =========================

    private Long slotId;

    private Integer slotNo;


    // =========================
    // STAY INFORMATION
    // =========================

    private LocalDate checkIn;

    private LocalDate checkOut;

    private String allocationStatus;
}