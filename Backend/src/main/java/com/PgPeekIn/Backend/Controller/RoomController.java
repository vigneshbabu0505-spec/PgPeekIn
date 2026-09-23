package com.PgPeekIn.Backend.Controller;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PgPeekIn.Backend.Models.RoomAvailabilityResponse;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/PgPeekIn/pgs")
public class RoomController
{
    private final RoomService roomService;

    @PostMapping("/{pgId}/rooms")
    public ResponseEntity<Room> createRoom(
            @PathVariable Long pgId,
            @RequestBody Room room)
    {
        room.setPgId(pgId);
        Room savedRoom = roomService.createRoom(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }
    @GetMapping("/{pgId}/rooms/available")
    public ResponseEntity<List<RoomAvailabilityResponse>> getAvailableRooms(
        @PathVariable Long pgId,
        @RequestParam LocalDate checkinDate,
        @RequestParam LocalDate checkoutDate,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Integer sharingType) {
            List<RoomAvailabilityResponse> rooms =roomService.getAvailableRooms(
                    pgId,
                    checkinDate,
                    checkoutDate,
                    category,
                    sharingType);
            return ResponseEntity.ok(rooms);
    }
    @GetMapping("/{pgId}/rooms")
    public ResponseEntity<List<Room>> getRooms(@PathVariable Long pgId)
    {
        List<Room> rooms = roomService.getRoomsByPgId(pgId);
        return ResponseEntity.ok(rooms);
    }

    @PutMapping("/{pgId}/rooms/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long pgId, @PathVariable Long roomId, @RequestBody Room room)
    {
            Room updatedRoom = roomService.updateRoom(roomId, pgId, room);
            return ResponseEntity.ok(updatedRoom);
    }
}