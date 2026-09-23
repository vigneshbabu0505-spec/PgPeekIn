package com.PgPeekIn.Backend.Service;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.BookingDashboardDTO;
import com.PgPeekIn.Backend.Models.OwnerBookingDTO;
import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Models.Slot;
import com.PgPeekIn.Backend.Models.SlotAllocation;
import com.PgPeekIn.Backend.Models.User;
import com.PgPeekIn.Backend.Repository.AuthRepository;
import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.RoomRepository;
import com.PgPeekIn.Backend.Repository.SlotAllocationRepository;
import com.PgPeekIn.Backend.Repository.SlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private PgRepo pgRepo;

    @Autowired
    private AuthRepository authRepository;

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final SlotRepository slotRepository;
    private final SlotAllocationRepository slotAllocationRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            SlotRepository slotRepository,
            SlotAllocationRepository slotAllocationRepository) {

        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.slotRepository = slotRepository;
        this.slotAllocationRepository = slotAllocationRepository;
    }


    // =========================================================
    // TENANT DASHBOARD - LATEST BOOKING
    // =========================================================

    public BookingDashboardDTO getMyDashboardBooking(Long userId) {

        List<Booking> bookings =
                bookingRepository.findByUserId(userId);

        if (bookings.isEmpty()) {
            return null;
        }

        // Get latest booking
        Booking booking = bookings.get(bookings.size() - 1);

        // Get allocation
        SlotAllocation allocation =
                slotAllocationRepository
                        .findById(booking.getAllocationId())
                        .orElseThrow(() ->
                                new RuntimeException("Allocation not found"));

        // Get slot
        Slot slot =
                slotRepository
                        .findById(allocation.getSlotId())
                        .orElseThrow(() ->
                                new RuntimeException("Slot not found"));

        // Get room
        Room room =
                roomRepository
                        .findById(slot.getRoomId())
                        .orElseThrow(() ->
                                new RuntimeException("Room not found"));

        // Get PG
        PgModel pg =
                pgRepo
                        .findById(room.getPgId())
                        .orElseThrow(() ->
                                new RuntimeException("PG not found"));

        return BookingDashboardDTO.builder()
                .bookingId(booking.getBookingId())
                .pgName(pg.getPgname())
                .roomNo(room.getRoomNo())
                .area(pg.getArea())
                .city(pg.getCity())
                .slotNo(slot.getSlotNo())
                .checkIn(allocation.getCheckinDate())
                .checkOut(allocation.getCheckoutDate())
                .monthlyRent(room.getMonthlyRent())
                .bookingStatus(booking.getBookingStatus())
                .build();
    }


    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @Transactional
    public Booking createBooking(
            Long userId,
            Long roomId,
            LocalDate checkinDate,
            LocalDate checkoutDate) {

        if (!checkoutDate.isAfter(checkinDate)) {
            throw new RuntimeException(
                    "Checkout date must be after checkin date");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        List<Slot> slots = slotRepository.findByRoomId(roomId);

        if (slots.isEmpty()) {
            throw new RuntimeException(
                    "No slots available for this room");
        }

        Slot availableSlot = null;

        for (Slot slot : slots) {

            List<SlotAllocation> overlappingAllocations =
                    slotAllocationRepository
                            .findOverlappingActiveAllocations(
                                    slot.getSlotId(),
                                    checkinDate,
                                    checkoutDate);

            if (overlappingAllocations.isEmpty()) {
                availableSlot = slot;
                break;
            }
        }

        if (availableSlot == null) {
            throw new RuntimeException(
                    "Room is not available for the selected dates");
        }

        SlotAllocation allocation = SlotAllocation.builder()
                .slotId(availableSlot.getSlotId())
                .checkinDate(checkinDate)
                .checkoutDate(checkoutDate)
                .status("reserved")
                .build();

        SlotAllocation savedAllocation =
                slotAllocationRepository.save(allocation);

        Booking booking = Booking.builder()
                .userId(userId)
                .allocationId(savedAllocation.getAllocationId())
                .bookingStatus("pending")
                .bookingDate(OffsetDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }


    // =========================================================
    // GET SINGLE BOOKING
    // =========================================================

    public Booking getBookingById(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }


    // =========================================================
    // GET TENANT BOOKINGS
    // =========================================================

    public List<Booking> getMyBookings(Long userId) {

        return bookingRepository.findByUserId(userId);
    }


    // =========================================================
    // OWNER - GET ALL BOOKINGS FOR OWNER'S PG
    // =========================================================

    public List<OwnerBookingDTO> getOwnerBookings(Long ownerUserId) {

        PgModel ownerPg = pgRepo.findByUserid(ownerUserId);

        if (ownerPg == null) {
            throw new RuntimeException(
                    "You do not have a PG");
        }

        List<OwnerBookingDTO> result = new ArrayList<>();

        List<Booking> allBookings =
                bookingRepository.findAllByOrderByBookingDateDesc();

        for (Booking booking : allBookings) {

            OwnerBookingDTO dto =
                    buildOwnerBookingDTO(booking, ownerPg);

            if (dto != null) {
                result.add(dto);
            }
        }

        return result;
    }


    // =========================================================
    // OWNER - GET SINGLE BOOKING DETAILS
    // =========================================================

    public OwnerBookingDTO getOwnerBookingDetails(
            Long ownerUserId,
            Long bookingId) {

        PgModel ownerPg = pgRepo.findByUserid(ownerUserId);

        if (ownerPg == null) {
            throw new RuntimeException(
                    "You do not have a PG");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        OwnerBookingDTO dto =
                buildOwnerBookingDTO(booking, ownerPg);

        if (dto == null) {
            throw new RuntimeException(
                    "You are not authorized to view this booking");
        }

        return dto;
    }


    // =========================================================
    // BUILD OWNER BOOKING DTO
    // =========================================================

    private OwnerBookingDTO buildOwnerBookingDTO(
            Booking booking,
            PgModel ownerPg) {

        // -----------------------------------------------------
        // Get allocation
        // -----------------------------------------------------

        SlotAllocation allocation =
                slotAllocationRepository
                        .findById(booking.getAllocationId())
                        .orElse(null);

        if (allocation == null) {
            return null;
        }


        // -----------------------------------------------------
        // Get slot
        // -----------------------------------------------------

        Slot slot =
                slotRepository
                        .findById(allocation.getSlotId())
                        .orElse(null);

        if (slot == null) {
            return null;
        }


        // -----------------------------------------------------
        // Get room
        // -----------------------------------------------------

        Room room =
                roomRepository
                        .findById(slot.getRoomId())
                        .orElse(null);

        if (room == null) {
            return null;
        }


        // -----------------------------------------------------
        // SECURITY CHECK
        // -----------------------------------------------------

        // Make sure this room belongs to the owner's PG.
        if (!room.getPgId().equals(ownerPg.getPgid())) {
            return null;
        }


        // -----------------------------------------------------
        // Get tenant
        // -----------------------------------------------------

        User tenant =
                authRepository
                        .findById(booking.getUserId())
                        .orElse(null);

        if (tenant == null) {
            return null;
        }


        // -----------------------------------------------------
        // Build response
        // -----------------------------------------------------

        return OwnerBookingDTO.builder()

                // Booking
                .bookingId(booking.getBookingId())
                .bookingDate(booking.getBookingDate())
                .bookingStatus(booking.getBookingStatus())

                // Tenant
                .tenantId(tenant.getId())
                .tenantName(tenant.getUser_name())
                .tenantEmail(tenant.getEmail())
                .tenantPhone(tenant.getUser_phone())

                // PG
                .pgId(ownerPg.getPgid())
                .pgName(ownerPg.getPgname())
                .pgType(ownerPg.getPgtype())
                .pgArea(ownerPg.getArea())
                .pgCity(ownerPg.getCity())

                // Room
                .roomId(room.getRoomId())
                .roomNo(room.getRoomNo())
                .roomCategory(room.getCategory())
                .sharingType(room.getSharingType())
                .monthlyRent(room.getMonthlyRent())
                .dailyRent(room.getDailyRent())

                // Slot
                .slotId(slot.getSlotId())
                .slotNo(slot.getSlotNo())

                // Stay
                .checkIn(allocation.getCheckinDate())
                .checkOut(allocation.getCheckoutDate())
                .allocationStatus(allocation.getStatus())

                .build();
    }
}