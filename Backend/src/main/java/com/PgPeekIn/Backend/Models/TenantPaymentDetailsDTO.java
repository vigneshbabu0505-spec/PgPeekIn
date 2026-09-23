package com.PgPeekIn.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantPaymentDetailsDTO {

    private Long bookingId;

    private String bookingStatus;

    private Long allocationId;

    private Long slotId;

    private Integer slotNo;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Long roomId;

    private String roomNo;

    private String category;

    private Integer sharingType;

    private BigDecimal monthlyRent;

    private BigDecimal dailyRent;

    private Long pgId;

    private String pgName;

    private String pgType;

    private String pgBranch;

    private String pgPhone;

    private String street;

    private String area;

    private String city;

    private String pincode;
}