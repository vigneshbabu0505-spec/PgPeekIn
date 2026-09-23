import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MyPGs from "./pages/owner/MyPGs";
import AddPG from "./pages/owner/AddPG";
import ManageRooms from "./pages/owner/ManageRooms";
import Bookings from "./pages/owner/Bookings";
import BookingDetails from "./pages/owner/BookingDetails";
import Tenant from "./pages/owner/Tenants";
import Profile from "./pages/owner/Profile";
import EditPG from "./pages/owner/EditPG";

import TenantDashboard from "./pages/tenant/TenantDashboard";
import SearchPG from "./pages/tenant/SearchPG";
import PGDetails from "./pages/tenant/PGDetails";
import RoomFilter from "./pages/tenant/RoomFilter";
import Booking from "./pages/tenant/Booking";
import TenantBookingDetails from "./pages/tenant/TenantBookingDetails";
import AddReview from "./pages/tenant/AddReview";
import Payment from "./pages/tenant/Payment";
import PaymentSuccess from "./pages/tenant/PaymentSuccess";
import TenantBookings from "./pages/tenant/TenantBookings";
import TenantProfile from "./pages/tenant/TenantProfile";
import TenantReviews from "./pages/tenant/TenantReviews";

function App() {
    return (
        <Routes>

            {/* ================= AUTH ================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ================= OWNER ================= */}

            <Route
                path="/owner-dashboard"
                element={<OwnerDashboard />}
            />

            <Route
                path="/owner/my-pgs"
                element={<MyPGs />}
            />
            <Route
            path="/owner/edit-pg/:pgid"
            element={<EditPG />}
            />

            <Route
                path="/owner/add-pg"
                element={<AddPG />}
            />

            <Route
                path="/owner/rooms"
                element={<ManageRooms />}
            />

            <Route
                path="/owner/bookings"
                element={<Bookings />}
            />

            <Route
                path="/owner/bookings/:bookingId"
                element={<BookingDetails />}
            />

            <Route
                path="/owner/tenants"
                element={<Tenant />}
            />

            <Route
                path="/owner/profile"
                element={<Profile />}
            />


            {/* ================= TENANT ================= */}

            <Route
                path="/tenant-dashboard"
                element={<TenantDashboard />}
            />

            <Route
                path="/tenant/search-pg"
                element={<SearchPG />}
            />

            <Route
                path="/tenant/pg/:id"
                element={<PGDetails />}
            />

            <Route
                path="/tenant/pg/:id/rooms"
                element={<RoomFilter />}
            />

            <Route
                path="/tenant/pg/:id/booking"
                element={<Booking />}
            />

            {/* Tenant Booking Details */}
            <Route
                path="/tenant/bookings/:bookingId"
                element={<TenantBookingDetails />}
            />
            <Route
            path="/tenant/bookings/:bookingId/review"
            element={<AddReview />}
            />

            {/* Tenant Payment */}
            <Route
                path="/tenant/payment/:bookingId"
                element={<Payment />}
            />

            {/* Payment Success */}
            <Route
                path="/tenant/payment-success"
                element={<PaymentSuccess />}
            />

            {/* Tenant Bookings */}
            <Route
                path="/tenant/bookings"
                element={<TenantBookings />}
            />

            {/* Tenant Profile */}
            <Route
                path="/tenant/profile"
                element={<TenantProfile />}
            />

            {/* Tenant Reviews */}
            <Route
                path="/tenant/reviews"
                element={<TenantReviews />}
            />

        </Routes>
    );
}

export default App;