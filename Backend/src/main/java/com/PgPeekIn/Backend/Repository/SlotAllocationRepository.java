package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.SlotAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SlotAllocationRepository
        extends JpaRepository<SlotAllocation, Long> {

    List<SlotAllocation> findBySlotId(Long slotId);

    @Query("""
        SELECT sa
        FROM SlotAllocation sa
        WHERE sa.slotId = :slotId
        AND sa.status IN ('reserved', 'occupied')
        AND sa.checkinDate < :checkoutDate
        AND sa.checkoutDate > :checkinDate
    """)
    List<SlotAllocation> findOverlappingActiveAllocations(
            @Param("slotId") Long slotId,
            @Param("checkinDate") LocalDate checkinDate,
            @Param("checkoutDate") LocalDate checkoutDate
    );
}