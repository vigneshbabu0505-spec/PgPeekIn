package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByRoomId(Long roomId);
}