package com.PgPeekIn.Backend.Models;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "room")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Room
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;
    @Column(name = "pg_id", nullable = false)
    private Long pgId;
    @Column(name = "room_no", nullable = false)
    private String roomNo;
    @Column(name = "category")
    private String category;
    @Column(name = "sharing_type", nullable = false)
    private Integer sharingType;
    @Column(name = "monthly_rent")
    private BigDecimal monthlyRent;
    @Column(name = "daily_rent")
    private BigDecimal dailyRent;
}