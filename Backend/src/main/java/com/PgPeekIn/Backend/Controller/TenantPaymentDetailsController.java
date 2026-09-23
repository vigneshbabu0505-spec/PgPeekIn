package com.PgPeekIn.Backend.Controller;

import com.PgPeekIn.Backend.Models.Booking;
import com.PgPeekIn.Backend.Models.PgModel;
import com.PgPeekIn.Backend.Models.Room;
import com.PgPeekIn.Backend.Models.Slot;
import com.PgPeekIn.Backend.Models.SlotAllocation;
import com.PgPeekIn.Backend.Models.TenantPaymentDetailsDTO;

import com.PgPeekIn.Backend.Repository.BookingRepository;
import com.PgPeekIn.Backend.Repository.PgRepo;
import com.PgPeekIn.Backend.Repository.RoomRepository;
import com.PgPeekIn.Backend.Repository.SlotAllocationRepository;
import com.PgPeekIn.Backend.Repository.SlotRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenant/payment-details")
public class TenantPaymentDetailsController {

    private final BookingRepository bookingRepository;
    private final SlotAllocationRepository slotAllocationRepository;
    private final SlotRepository slotRepository;
    private final RoomRepository roomRepository;
    private final PgRepo pgRepo;

    public TenantPaymentDetailsController(
            BookingRepository bookingRepository,
            SlotAllocationRepository slotAllocationRepository,
            SlotRepository slotRepository,
            RoomRepository roomRepository,
            PgRepo pgRepo
    ) {
        this.bookingRepository = bookingRepository;
        this.slotAllocationRepository = slotAllocationRepository;
        this.slotRepository = slotRepository;
        this.roomRepository = roomRepository;
        this.pgRepo = pgRepo;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<TenantPaymentDetailsDTO> getPaymentDetails(
            @PathVariable Long bookingId
    ) {

        // 1. Get booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found")
                );

        // 2. Get allocation
        SlotAllocation allocation =
                slotAllocationRepository.findById(
                        booking.getAllocationId()
                ).orElseThrow(() ->
                        new RuntimeException("Allocation not found")
                );

        // 3. Get slot
        Slot slot =
                slotRepository.findById(
                        allocation.getSlotId()
                ).orElseThrow(() ->
                        new RuntimeException("Slot not found")
                );

        // 4. Get room
        Room room =
                roomRepository.findById(
                        slot.getRoomId()
                ).orElseThrow(() ->
                        new RuntimeException("Room not found")
                );

        // 5. Get PG
        PgModel pg =
                pgRepo.findById(
                        room.getPgId()
                ).orElseThrow(() ->
                        new RuntimeException("PG not found")
                );

        // 6. Build response
        TenantPaymentDetailsDTO response =
                TenantPaymentDetailsDTO.builder()

                        .bookingId(booking.getBookingId())

                        .bookingStatus(
                                booking.getBookingStatus()
                        )

                        .allocationId(
                                allocation.getAllocationId()
                        )

                        .slotId(
                                slot.getSlotId()
                        )

                        .slotNo(
                                slot.getSlotNo()
                        )

                        .checkInDate(
                                allocation.getCheckinDate()
                        )

                        .checkOutDate(
                                allocation.getCheckoutDate()
                        )

                        .roomId(
                                room.getRoomId()
                        )

                        .roomNo(
                                room.getRoomNo()
                        )

                        .category(
                                room.getCategory()
                        )

                        .sharingType(
                                room.getSharingType()
                        )

                        .monthlyRent(
                                room.getMonthlyRent()
                        )

                        .dailyRent(
                                room.getDailyRent()
                        )

                        .pgId(
                                pg.getPgid()
                        )

                        .pgName(
                                pg.getPgname()
                        )

                        .pgType(
                                pg.getPgtype()
                        )

                        .pgBranch(
                                pg.getPgbranch()
                        )

                        .pgPhone(
                                pg.getPgphnno()
                        )

                        .street(
                                pg.getStreet()
                        )

                        .area(
                                pg.getArea()
                        )

                        .city(
                                pg.getCity()
                        )

                        .pincode(
                                pg.getPincode()
                        )

                        .build();

        return ResponseEntity.ok(response);
    }
}