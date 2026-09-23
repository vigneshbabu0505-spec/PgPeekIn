package com.PgPeekIn.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantReviewDTO {

    private Long reviewId;
    private Long bookingId;
    private Long pgId;
    private String pgName;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;
}