package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Models.Slot;
import com.PgPeekIn.Backend.Models.SlotAllocation;
import com.PgPeekIn.Backend.Models.RoomAvailabilityResponse;
import com.PgPeekIn.Backend.Models.User;

import com.PgPeekIn.Backend.Repository.RoomRepository;
import com.PgPeekIn.Backend.Repository.SlotRepository;
import com.PgPeekIn.Backend.Repository.SlotAllocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PgRepo pgRepo;

    // =========================================================
    // CREATE ROOM
    // =========================================================

    public Room createRoom(Room room) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = authService.getProfile(email);

        PgModel ownerPg = pgRepo.findByUserid(user.getId());

        if (ownerPg == null) {
            throw new RuntimeException(
                    "You do not have a PG"
            );
        }

        if (!ownerPg.getPgid().equals(room.getPgId())) {
            throw new RuntimeException(
                    "You are not authorized to add rooms to this PG"
            );
        }

        if (room.getSharingType() == null ||
                room.getSharingType() < 1 ||
                room.getSharingType() > 4) {

            throw new RuntimeException(
                    "Sharing type must be between 1 and 4"
            );
        }

        return roomRepository.save(room);
    }

    // =========================================================
    // GET ROOMS
    // =========================================================

    public List<Room> getRoomsByPgId(Long pgId) {
        return roomRepository.findByPgId(pgId);
    }

    // =========================================================
    // UPDATE ROOM
    // =========================================================

    public Room updateRoom(
            Long roomId,
            Long pgId,
            Room updatedRoom) {

        // -----------------------------------------------------
        // Get logged-in owner's email
        // -----------------------------------------------------

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // -----------------------------------------------------
        // Get logged-in user
        // -----------------------------------------------------

        User user = authService.getProfile(email);

        // -----------------------------------------------------
        // Find PG owned by this user
        // -----------------------------------------------------

        PgModel ownerPg = pgRepo.findByUserid(user.getId());

        if (ownerPg == null) {
            throw new RuntimeException(
                    "You do not have a PG"
            );
        }

        // -----------------------------------------------------
        // Verify PG ownership
        // -----------------------------------------------------

        if (!ownerPg.getPgid().equals(pgId)) {
            throw new RuntimeException(
                    "You are not authorized to update rooms in this PG"
            );
        }

        // -----------------------------------------------------
        // Find existing room
        // -----------------------------------------------------

        Room existingRoom = roomRepository
                .findById(roomId)
                .orElseThrow(
                        () -> new RuntimeException("Room not found")
                );

        // -----------------------------------------------------
        // Verify room belongs to requested PG
        // -----------------------------------------------------

        if (!existingRoom.getPgId().equals(pgId)) {
            throw new RuntimeException(
                    "Room does not belong to this PG"
            );
        }

        // -----------------------------------------------------
        // Validate sharing type from request
        // -----------------------------------------------------

        if (updatedRoom.getSharingType() == null ||
                updatedRoom.getSharingType() < 1 ||
                updatedRoom.getSharingType() > 4) {

            throw new RuntimeException(
                    "Sharing type must be between 1 and 4"
            );
        }

        // -----------------------------------------------------
        // Sharing type cannot be changed
        //
        // It determines the number of slots belonging to
        // this room. Changing it requires separate slot
        // management and allocation handling.
        // -----------------------------------------------------

        if (!existingRoom.getSharingType()
                .equals(updatedRoom.getSharingType())) {

            throw new RuntimeException(
                    "Sharing type cannot be changed while editing a room"
            );
        }

        // -----------------------------------------------------
        // Update editable fields
        // -----------------------------------------------------

        existingRoom.setRoomNo(
                updatedRoom.getRoomNo()
        );

        existingRoom.setCategory(
                updatedRoom.getCategory()
        );

        // Keep original sharing type
        existingRoom.setSharingType(
                existingRoom.getSharingType()
        );

        existingRoom.setMonthlyRent(
                updatedRoom.getMonthlyRent()
        );

        existingRoom.setDailyRent(
                updatedRoom.getDailyRent()
        );

        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        return roomRepository.save(existingRoom);
    }

    // =========================================================
    // SLOT REPOSITORIES
    // =========================================================

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private SlotAllocationRepository slotAllocationRepository;

    // =========================================================
    // AVAILABLE ROOMS
    // =========================================================

    public List<RoomAvailabilityResponse> getAvailableRooms(
            Long pgId,
            LocalDate checkinDate,
            LocalDate checkoutDate,
            String category,
            Integer sharingType) {

        if (!checkoutDate.isAfter(checkinDate)) {
            throw new RuntimeException(
                    "Checkout date must be after checkin date"
            );
        }

        List<Room> rooms =
                roomRepository.findByPgId(pgId);

        List<RoomAvailabilityResponse> result =
                new ArrayList<>();

        for (Room room : rooms) {

            if (category != null &&
                    !category.equalsIgnoreCase(
                            room.getCategory())) {

                continue;
            }

            if (sharingType != null &&
                    !sharingType.equals(
                            room.getSharingType())) {

                continue;
            }

            List<Slot> slots =
                    slotRepository.findByRoomId(
                            room.getRoomId()
                    );

            int totalSlots = slots.size();

            int availableSlots = 0;

            for (Slot slot : slots) {

                List<SlotAllocation>
                        overlappingAllocations =
                        slotAllocationRepository
                                .findOverlappingActiveAllocations(
                                        slot.getSlotId(),
                                        checkinDate,
                                        checkoutDate
                                );

                if (overlappingAllocations.isEmpty()) {
                    availableSlots++;
                }
            }

            if (availableSlots > 0) {

                result.add(
                        new RoomAvailabilityResponse(
                                room.getRoomId(),
                                room.getPgId(),
                                room.getRoomNo(),
                                room.getCategory(),
                                room.getSharingType(),
                                room.getMonthlyRent(),
                                room.getDailyRent(),
                                totalSlots,
                                availableSlots,
                                true
                        )
                );
            }
        }

        return result;
    }
}