package com.PgPeekIn.Backend.Models;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {

    private Long roomId;

    private LocalDate checkinDate;

    private LocalDate checkoutDate;
}