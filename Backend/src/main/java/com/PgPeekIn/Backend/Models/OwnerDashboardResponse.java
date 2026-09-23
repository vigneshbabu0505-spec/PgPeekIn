package com.PgPeekIn.Backend.Models;



import java.util.List;


public class OwnerDashboardResponse {

    private long totalPgs;
    private long totalRooms;
    private long availableSlots;
    private long occupiedSlots;

    private List<BookingTrend> bookingTrends;
    private List<RecentBooking> recentBookings;

    public OwnerDashboardResponse() {
    }

    public OwnerDashboardResponse(
            long totalPgs,
            long totalRooms,
            long availableSlots,
            long occupiedSlots,
            List<BookingTrend> bookingTrends,
            List<RecentBooking> recentBookings) {

        this.totalPgs = totalPgs;
        this.totalRooms = totalRooms;
        this.availableSlots = availableSlots;
        this.occupiedSlots = occupiedSlots;
        this.bookingTrends = bookingTrends;
        this.recentBookings = recentBookings;
    }

    public long getTotalPgs() {
        return totalPgs;
    }

    public void setTotalPgs(long totalPgs) {
        this.totalPgs = totalPgs;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(long availableSlots) {
        this.availableSlots = availableSlots;
    }

    public long getOccupiedSlots() {
        return occupiedSlots;
    }

    public void setOccupiedSlots(long occupiedSlots) {
        this.occupiedSlots = occupiedSlots;
    }

    public List<BookingTrend> getBookingTrends() {
        return bookingTrends;
    }

    public void setBookingTrends(List<BookingTrend> bookingTrends) {
        this.bookingTrends = bookingTrends;
    }

    public List<RecentBooking> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<RecentBooking> recentBookings) {
        this.recentBookings = recentBookings;
    }

    public static class BookingTrend {

        private String month;
        private long bookings;

        public BookingTrend(String month, long bookings) {
            this.month = month;
            this.bookings = bookings;
        }

        public String getMonth() {
            return month;
        }

        public long getBookings() {
            return bookings;
        }
    }

    public static class RecentBooking {

        private String name;
        private String pg;
        private String room;
        private String status;

        public RecentBooking(
                String name,
                String pg,
                String room,
                String status) {

            this.name = name;
            this.pg = pg;
            this.room = room;
            this.status = status;
        }

        public String getName() {
            return name;
        }

        public String getPg() {
            return pg;
        }

        public String getRoom() {
            return room;
        }

        public String getStatus() {
            return status;
        }
    }
}