package com.PgPeekIn.Backend.Repository;

import com.PgPeekIn.Backend.Models.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByPgId(Long pgId);

    List<Room> findAllByPgIdIn(List<Long> pgIds);
}