import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";
import { apiRequest } from "../../api/api";

function Booking() {
    console.log("🔥 BOOKING COMPONENT IS LOADED");
    const location = useLocation();
    const navigate = useNavigate();

    const {
        pg,
        room,
        checkInDate,
        checkOutDate,
    } = location.state || {};

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "Not selected";
        }

        const [year, month, day] = date.split("-");

        return `${day}-${month}-${year}`;
    };

    // ==========================================
    // CREATE BOOKING AND GO TO PAYMENT
    // ==========================================

    const handleContinuePayment = async () => {

        if (!checkInDate || !checkOutDate) {
            alert(
                "Please select check-in and check-out dates."
            );
            return;
        }

        if (
            new Date(checkOutDate) <=
            new Date(checkInDate)
        ) {
            alert(
                "Check-out date must be after check-in date."
            );
            return;
        }

        if (!room?.roomId) {
            alert(
                "Room information is missing. Please select the room again."
            );
            return;
        }

        try {

            const bookingRequest = {
                roomId: room.roomId,
                checkinDate: checkInDate,
                checkoutDate: checkOutDate,
            };

            console.log(
                "Creating booking:",
                bookingRequest
            );

            // ======================================
            // CREATE BOOKING
            // ======================================

            const booking = await apiRequest(
                "/api/bookings",
                {
                    method: "POST",
                    body: JSON.stringify(
                        bookingRequest
                    ),
                }
            );

            console.log(
                "Booking created:",
                booking
            );

            // ======================================
            // CHECK BOOKING ID
            // ======================================

            if (
                !booking ||
                !booking.bookingId
            ) {
                throw new Error(
                    "Booking was created but booking ID was not returned."
                );
            }

            console.log(
                "Booking ID:",
                booking.bookingId
            );

            // ======================================
            // GO TO PAYMENT
            // ======================================

            navigate(
                `/tenant/payment/${booking.bookingId}`
            );

        } catch (error) {

            console.error(
                "Booking creation error:",
                error
            );

            alert(
                error.message ||
                "Unable to create booking. Please try again."
            );
        }
    };

    // ==========================================
    // NO ROOM DATA
    // ==========================================

    if (!pg || !room) {

        return (
            <div className="tenant-page">

                <aside className="tenant-sidebar">

                    <div className="tenant-brand">

                        <img
                            src={logo}
                            alt="PGPeekIn"
                        />

                        <div>
                            <h2>PGPeekIn</h2>
                            <p>Tenant panel</p>
                        </div>

                    </div>

                    <nav className="tenant-menu">

                        <Link to="/tenant-dashboard">
                            <span>⌂</span>
                            Dashboard
                        </Link>

                        <Link to="/tenant/search-pg">
                            <span>⌕</span>
                            Search PG
                        </Link>

                        <Link
                            to="/tenant/bookings"
                        >
                            <span>▣</span>
                            My bookings
                        </Link>

                        <Link to="/tenant/reviews">
                            <span>☆</span>
                            My reviews
                        </Link>

                        <Link to="/tenant/profile">
                            <span>♙</span>
                            My profile
                        </Link>

                    </nav>

                    <Link
                        to="/login"
                        className="tenant-logout"
                    >
                        <span>⇥</span>
                        Log out
                    </Link>

                </aside>

                <main className="tenant-main">

                    <div className="booking-empty">

                        <h2>
                            No room selected
                        </h2>

                        <p>
                            Please select a room before
                            continuing with your booking.
                        </p>

                        <Link
                            to="/tenant/search-pg"
                            className="booking-back-button"
                        >
                            Search PGs
                        </Link>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // BOOKING PAGE
    // ==========================================

    return (
        <div className="tenant-page">

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="tenant-sidebar">

                <div className="tenant-brand">

                    <img
                        src={logo}
                        alt="PGPeekIn"
                    />

                    <div>
                        <h2>PGPeekIn</h2>
                        <p>Tenant panel</p>
                    </div>

                </div>

                <nav className="tenant-menu">

                    <Link to="/tenant-dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/tenant/search-pg"
                        className="active"
                    >
                        <span>⌕</span>
                        Search PG
                    </Link>

                    <Link to="/tenant/bookings">
                        <span>▣</span>
                        My bookings
                    </Link>

                    <Link to="/tenant/reviews">
                        <span>☆</span>
                        My reviews
                    </Link>

                    <Link to="/tenant/profile">
                        <span>♙</span>
                        My profile
                    </Link>

                </nav>

                <Link
                    to="/login"
                    className="tenant-logout"
                >
                    <span>⇥</span>
                    Log out
                </Link>

            </aside>

            {/* =====================================
                MAIN
            ===================================== */}

            <main className="tenant-main">

                {/* =================================
                    HEADER
                ================================= */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Confirm your booking
                        </h1>

                        <p>
                            Review your selected room and
                            stay details before payment.
                        </p>

                    </div>

                    <div className="tenant-user">

                        <div className="tenant-avatar">
                            Y
                        </div>

                        <div>

                            <strong>
                                Yuva
                            </strong>

                            <span>
                                Tenant account
                            </span>

                        </div>

                    </div>

                </header>

                {/* =================================
                    BREADCRUMB
                ================================= */}

                <div className="booking-breadcrumb">

                    <Link to="/tenant/search-pg">
                        Search PG
                    </Link>

                    <span>→</span>

                    <Link
                        to={`/tenant/pg/${pg.PG_id}`}
                    >
                        {pg.Pg_name}
                    </Link>

                    <span>→</span>

                    <Link
                        to={`/tenant/pg/${pg.PG_id}/rooms`}
                    >
                        Rooms
                    </Link>

                    <span>→</span>

                    <strong>
                        Booking
                    </strong>

                </div>

                {/* =================================
                    PROPERTY
                ================================= */}

                <section className="booking-property-card">

                    <div>

                        <p className="booking-eyebrow">
                            SELECTED PROPERTY
                        </p>

                        <h2>
                            {pg.Pg_name}
                        </h2>

                        <p>
                            📍 {pg.Area}, {pg.City}
                        </p>

                    </div>

                    <div className="booking-property-status">
                        Selected
                    </div>

                </section>

                {/* =================================
                    BOOKING LAYOUT
                ================================= */}

                <section className="booking-layout">

                    {/* =================================
                        LEFT
                    ================================= */}

                    <div className="booking-main-card">

                        <div className="booking-section-title">

                            <div>

                                <p className="booking-eyebrow">
                                    ROOM DETAILS
                                </p>

                                <h2>
                                    Your selected room
                                </h2>

                            </div>

                            <span className="booking-room-number">
                                Room {room.roomNo}
                            </span>

                        </div>

                        {/* ROOM DETAILS */}

                        <div className="booking-room-box">

                            <div className="booking-room-visual">

                                <span>
                                    ROOM
                                </span>

                                <strong>
                                    {room.roomNo}
                                </strong>

                            </div>

                            <div className="booking-room-info">

                                <div>

                                    <span>
                                        Sharing
                                    </span>

                                    <strong>
                                        {room.sharingType} Sharing
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {room.category}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Daily Rent
                                    </span>

                                    <strong>
                                        ₹{room.dailyRent ?? "N/A"}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Monthly Rent
                                    </span>

                                    <strong>
                                        ₹{room.monthlyRent ?? "N/A"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            STAY DATES
                        ================================= */}

                        <div className="booking-date-section">

                            <p className="booking-eyebrow">
                                STAY DATES
                            </p>

                            <div className="booking-date-grid">

                                <div className="booking-date-box">

                                    <span>
                                        Check-in
                                    </span>

                                    <strong>
                                        {formatDate(
                                            checkInDate
                                        )}
                                    </strong>

                                </div>

                                <div className="booking-date-arrow">
                                    →
                                </div>

                                <div className="booking-date-box">

                                    <span>
                                        Check-out
                                    </span>

                                    <strong>
                                        {formatDate(
                                            checkOutDate
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            INFORMATION
                        ================================= */}

                        <div className="booking-info-note">

                            <div className="booking-info-icon">
                                i
                            </div>

                            <div>

                                <strong>
                                    Availability is checked
                                    before confirmation
                                </strong>

                                <p>
                                    Your selected slot will
                                    be checked against the
                                    Slot Allocation records
                                    before the booking is created.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =================================
                        RIGHT SUMMARY
                    ================================= */}

                    <aside className="booking-summary-card">

                        <p className="booking-eyebrow">
                            BOOKING SUMMARY
                        </p>

                        <h2>
                            Review your stay
                        </h2>

                        <div className="booking-summary-list">

                            <div>

                                <span>
                                    Property
                                </span>

                                <strong>
                                    {pg.Pg_name}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Room
                                </span>

                                <strong>
                                    {room.roomNo} ·{" "}
                                    {room.sharingType} Sharing
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {room.category}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Check-in
                                </span>

                                <strong>
                                    {formatDate(
                                        checkInDate
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Check-out
                                </span>

                                <strong>
                                    {formatDate(
                                        checkOutDate
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Daily rent
                                </span>

                                <strong>
                                    ₹{room.dailyRent ?? "N/A"}
                                </strong>

                            </div>

                        </div>

                        {/* STATUS */}

                        <div className="booking-status-row">

                            <span>
                                Booking status
                            </span>

                            <strong>
                                Pending
                            </strong>

                        </div>

                        {/* =================================
                            PAYMENT BUTTON
                        ================================= */}

                        <button
                            type="button"
                            className="booking-payment-button"
                            onClick={
                                handleContinuePayment
                            }
                        >

                            Continue to Payment

                            <span>
                                →
                            </span>

                        </button>

                        {/* CHANGE ROOM */}

                        <Link
                            to={`/tenant/pg/${pg.PG_id}/rooms`}
                            className="booking-change-room"
                        >
                            ← Change Room
                        </Link>

                    </aside>

                </section>

            </main>

        </div>
    );
}

export default Booking;