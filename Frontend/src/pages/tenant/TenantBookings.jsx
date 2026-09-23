import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

import { apiRequest } from "../../api/api";

function TenantBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // GET LOGGED-IN USER
    // ==============================

    const getLoggedInUser = () => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                return {
                    user_name: "User",
                    role: "Tenant"
                };
            }

            const user = JSON.parse(storedUser);

            return {
                user_name:
                    user.user_name ||
                    user.userName ||
                    user.name ||
                    "User",

                role:
                    user.role ||
                    "Tenant"
            };

        } catch (error) {
            console.error("Failed to read logged-in user:", error);

            return {
                user_name: "User",
                role: "Tenant"
            };
        }
    };

    const loggedInUser = getLoggedInUser();

    const userName = loggedInUser.user_name;

    const userInitial =
        userName && userName.length > 0
            ? userName.charAt(0).toUpperCase()
            : "U";

    const userRole =
        loggedInUser.role
            ? loggedInUser.role.charAt(0).toUpperCase() +
              loggedInUser.role.slice(1)
            : "Tenant";


    // ==============================
    // FETCH BOOKINGS
    // ==============================

    useEffect(() => {
        fetchMyBookings();
    }, []);


    const fetchMyBookings = async () => {

        try {

            setLoading(true);
            setError("");

            console.log("Fetching my bookings...");

            const data = await apiRequest("/api/bookings/my");

            console.log("My bookings:", data);

            setBookings(data);

        } catch (error) {

            console.error("Failed to fetch bookings:", error);

            setError(
                error.message ||
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // FORMAT DATE
    // ==============================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // ==============================
    // STATUS CLASS
    // ==============================

    const getStatusClass = (status) => {

        switch (status?.toLowerCase()) {

            case "confirmed":
                return "confirmed";

            case "pending":
                return "pending";

            case "cancelled":
                return "cancelled";

            case "completed":
                return "completed";

            default:
                return "";
        }
    };


    return (

        <div className="tenant-page">


            {/* ==============================
                SIDEBAR
            ============================== */}

            <aside className="tenant-sidebar">

                <div className="tenant-brand">

                    <img
                        src={logo}
                        alt="PGPeekIn"
                    />

                    <div>

                        <h2>
                            PGPeekIn
                        </h2>

                        <p>
                            Tenant panel
                        </p>

                    </div>

                </div>


                <nav className="tenant-menu">

                    <Link to="/tenant-dashboard">

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </Link>


                    <Link to="/tenant/search-pg">

                        <span>
                            ⌕
                        </span>

                        Search PG

                    </Link>


                    <Link
                        to="/tenant/bookings"
                        className="active"
                    >

                        <span>
                            ▣
                        </span>

                        My bookings

                    </Link>


                    <Link to="/tenant/reviews">

                        <span>
                            ☆
                        </span>

                        My reviews

                    </Link>


                    <Link to="/tenant/profile">

                        <span>
                            ♙
                        </span>

                        My profile

                    </Link>

                </nav>


                <Link
                    to="/login"
                    className="tenant-logout"
                >

                    <span>
                        ⇥
                    </span>

                    Log out

                </Link>

            </aside>



            {/* ==============================
                MAIN CONTENT
            ============================== */}

            <main className="tenant-main">


                {/* ==============================
                    HEADER
                ============================== */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            View and manage your PG bookings.
                        </p>

                    </div>


                    {/* ACTUAL LOGGED-IN USER */}

                    <div className="tenant-user">

                        <div className="tenant-avatar">

                            {userInitial}

                        </div>

                        <div>

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                {userRole} account
                            </span>

                        </div>

                    </div>

                </header>



                {/* ==============================
                    BOOKINGS
                ============================== */}

                <section className="booking-history">


                    <div className="booking-history-header">

                        <div>

                            <p className="booking-eyebrow">
                                BOOKING HISTORY
                            </p>

                            <h2>
                                Your bookings
                            </h2>

                        </div>


                        <Link
                            to="/tenant/search-pg"
                            className="booking-back-button"
                        >
                            + Book a PG
                        </Link>

                    </div>



                    {/* ==============================
                        LOADING
                    ============================== */}

                    {loading && (

                        <div className="booking-empty">

                            <div className="booking-empty-icon">
                                ▣
                            </div>

                            <h2>
                                Loading bookings...
                            </h2>

                            <p>
                                Please wait while we fetch your bookings.
                            </p>

                        </div>

                    )}



                    {/* ==============================
                        ERROR
                    ============================== */}

                    {!loading && error && (

                        <div className="booking-empty">

                            <div className="booking-empty-icon">
                                !
                            </div>

                            <h2>
                                Unable to load bookings
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                className="booking-back-button"
                                onClick={fetchMyBookings}
                            >
                                Try Again
                            </button>

                        </div>

                    )}



                    {/* ==============================
                        EMPTY
                    ============================== */}

                    {!loading &&
                        !error &&
                        bookings.length === 0 && (

                        <div className="booking-empty">

                            <div className="booking-empty-icon">
                                ▣
                            </div>

                            <h2>
                                No bookings yet
                            </h2>

                            <p>
                                You haven't made any bookings yet.
                                Search for a PG and book a room to see
                                your bookings here.
                            </p>

                            <Link
                                to="/tenant/search-pg"
                                className="booking-back-button"
                            >
                                Search PGs
                            </Link>

                        </div>

                    )}



                    {/* ==============================
                        BOOKINGS LIST
                    ============================== */}

                    {!loading &&
                        !error &&
                        bookings.length > 0 && (

                        <div className="booking-list">

                            {bookings.map((booking) => (

                                <article
                                    className="booking-card"
                                    key={booking.bookingId}
                                >


                                    {/* ==============================
                                        BOOKING HEADER
                                    ============================== */}

                                    <div className="booking-card-header">

                                        <div>

                                            <p className="booking-eyebrow">
                                                BOOKING
                                            </p>

                                            <h3>
                                                Booking {booking.bookingId}
                                            </h3>

                                        </div>


                                        <span
                                            className={`booking-status ${getStatusClass(
                                                booking.bookingStatus
                                            )}`}
                                        >
                                            {booking.bookingStatus}
                                        </span>

                                    </div>



                                    {/* ==============================
                                        BOOKING DETAILS
                                    ============================== */}

                                    <div
                                        className="booking-card-details"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(2, minmax(0, 1fr))",
                                            columnGap: "60px",
                                            rowGap: "18px",
                                            padding: "6px 0 4px"
                                        }}
                                    >


                                        {/* BOOKING ID */}

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px"
                                            }}
                                        >

                                            <span>
                                                Booking ID
                                            </span>

                                            <strong>
                                                {booking.bookingId}
                                            </strong>

                                        </div>



                                        {/* ALLOCATION ID */}

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px"
                                            }}
                                        >

                                            <span>
                                                Allocation ID
                                            </span>

                                            <strong>
                                                {booking.allocationId}
                                            </strong>

                                        </div>



                                        {/* STATUS */}

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px"
                                            }}
                                        >

                                            <span>
                                                Status
                                            </span>

                                            <strong
                                                className={`booking-detail-status ${getStatusClass(
                                                    booking.bookingStatus
                                                )}`}
                                            >
                                                {booking.bookingStatus}
                                            </strong>

                                        </div>



                                        {/* BOOKING DATE */}

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px"
                                            }}
                                        >

                                            <span>
                                                Booking Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    booking.bookingDate
                                                )}
                                            </strong>

                                        </div>

                                    </div>



                                    {/* ==============================
                                        FOOTER
                                    ============================== */}

                                    <div className="booking-card-footer">
                                        <span>
                                            Your booking has been recorded successfully.
                                            </span>
                                            <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center"
                                            }}
                                            >
                                                <Link
                                                to={`/tenant/bookings/${booking.bookingId}`}
                                                className="booking-back-button"
                                                >
                                                    View Details →
                                                    </Link>
                                                    {booking.bookingStatus?.toLowerCase() === "confirmed" && (
                                                        <Link
                                                        to={`/tenant/bookings/${booking.bookingId}/review`}
                                                        className="booking-back-button"
                                                        style={{
                                                            background: "#f57c00",
                                                            color: "#ffffff",
                                                            textDecoration: "none"
                                                        }}
                                                        >
                                                            Add Review ★
                                                            </Link>
                                                        )}
                                                        </div>
                                                        </div>
                                                        </article>
                                                    ))}
                                                    </div>
                                                )}
                                                </section>
                                                </main>
                                                </div>
                                        );
                                    }
export default TenantBookings;