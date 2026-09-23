package com.PgPeekIn.Backend.Models;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomAvailabilityResponse {

    private Long roomId;
    private Long pgId;
    private String roomNo;
    private String category;
    private Integer sharingType;
    private BigDecimal monthlyRent;
    private BigDecimal dailyRent;
    private Integer totalSlots;
    private Integer availableSlots;
    private boolean available;
}