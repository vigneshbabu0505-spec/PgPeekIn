package com.PgPeekIn.Backend.Models;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingDashboardDTO
{
    private Long bookingId;
    private String pgName;
    private String roomNo;
    private String area;
    private String city;
    private Integer slotNo;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BigDecimal monthlyRent;
    private String bookingStatus;
}