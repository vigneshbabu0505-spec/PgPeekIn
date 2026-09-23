import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

import { apiRequest } from "../../api/api";

function TenantBookingDetails() {

    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // LOGGED-IN USER
    // ==============================

    const getLoggedInUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return {
                    user_name: "User",
                    role: "Tenant"
                };
            }

            const user =
                JSON.parse(storedUser);

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

            return {
                user_name: "User",
                role: "Tenant"
            };
        }
    };

    const loggedInUser = getLoggedInUser();

    const userName =
        loggedInUser.user_name;

    const userInitial =
        userName
            ? userName.charAt(0).toUpperCase()
            : "U";

    const userRole =
        loggedInUser.role
            ? loggedInUser.role.charAt(0).toUpperCase() +
              loggedInUser.role.slice(1)
            : "Tenant";


    // ==============================
    // FETCH BOOKING
    // ==============================

    useEffect(() => {

        fetchBooking();

    }, [bookingId]);


    const fetchBooking = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Fetching booking:",
                bookingId
            );

            const data =
                await apiRequest(
                    `/api/bookings/${bookingId}`
                );

            console.log(
                "Booking details:",
                data
            );

            setBooking(data);

        } catch (error) {

            console.error(
                "Failed to fetch booking:",
                error
            );

            setError(
                error.message ||
                "Unable to load booking details."
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

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ==============================
    // STATUS CLASS
    // ==============================

    const getStatusClass = (status) => {

        switch (
            status?.toLowerCase()
        ) {

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


    // ==============================
    // GO TO PAYMENT
    // ==============================

    const handlePayNow = () => {

        if (!booking?.bookingId) {
            alert("Booking information is not available.");
            return;
        }

        navigate(
            `/tenant/payment/${booking.bookingId}`
        );
    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="tenant-page">

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

                </aside>


                <main className="tenant-main">

                    <div className="booking-empty">

                        <div className="booking-empty-icon">
                            ▣
                        </div>

                        <h2>
                            Loading booking details...
                        </h2>

                        <p>
                            Please wait while we fetch your booking.
                        </p>

                    </div>

                </main>

            </div>

        );
    }


    // ==============================
    // ERROR
    // ==============================

    if (error || !booking) {

        return (

            <div className="tenant-page">

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

                </aside>


                <main className="tenant-main">

                    <div className="booking-empty">

                        <div className="booking-empty-icon">
                            !
                        </div>

                        <h2>
                            Unable to load booking
                        </h2>

                        <p>
                            {error ||
                                "Booking not found."}
                        </p>

                        <Link
                            to="/tenant/bookings"
                            className="booking-back-button"
                        >
                            ← Back to Bookings
                        </Link>

                    </div>

                </main>

            </div>

        );
    }


    // ==============================
    // MAIN PAGE
    // ==============================

    return (

        <div className="tenant-page">


            {/* ================= SIDEBAR ================= */}

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


            {/* ================= MAIN ================= */}

            <main className="tenant-main">


                {/* ================= HEADER ================= */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Booking Details
                        </h1>

                        <p>
                            View your booking information and payment status.
                        </p>

                    </div>


                    {/* ACTUAL USER */}

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


                {/* ================= BREADCRUMB ================= */}

                <div
                    style={{
                        marginBottom: "24px",
                        color: "#6f7f95",
                        fontSize: "14px"
                    }}
                >

                    <Link
                        to="/tenant/bookings"
                        style={{
                            color: "#f57c00",
                            textDecoration: "none"
                        }}
                    >
                        My Bookings
                    </Link>

                    <span style={{ margin: "0 10px" }}>
                        →
                    </span>

                    Booking {booking.bookingId}

                </div>


                {/* ================= BOOKING CARD ================= */}

                <section
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "28px",
                        boxShadow:
                            "0 8px 24px rgba(0,0,0,0.06)",
                        marginBottom: "24px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "20px",
                            borderBottom:
                                "1px solid #e7ebf0"
                        }}
                    >

                        <div>

                            <p className="booking-eyebrow">
                                BOOKING
                            </p>

                            <h2
                                style={{
                                    margin: "4px 0 0",
                                    color: "#13294b"
                                }}
                            >
                                Booking {booking.bookingId}
                            </h2>

                        </div>


                        <span
                            className={`booking-status ${getStatusClass(
                                booking.bookingStatus
                            )}`}
                        >
                            {booking.bookingStatus}
                        </span>

                    </div>


                    {/* DETAILS */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "24px 70px",
                            paddingTop: "26px"
                        }}
                    >

                        <div>

                            <span
                                style={{
                                    display: "block",
                                    color: "#718096",
                                    fontSize: "13px",
                                    marginBottom: "6px"
                                }}
                            >
                                Booking ID
                            </span>

                            <strong>
                                {booking.bookingId}
                            </strong>

                        </div>


                        <div>

                            <span
                                style={{
                                    display: "block",
                                    color: "#718096",
                                    fontSize: "13px",
                                    marginBottom: "6px"
                                }}
                            >
                                Allocation ID
                            </span>

                            <strong>
                                {booking.allocationId}
                            </strong>

                        </div>


                        <div>

                            <span
                                style={{
                                    display: "block",
                                    color: "#718096",
                                    fontSize: "13px",
                                    marginBottom: "6px"
                                }}
                            >
                                Booking Status
                            </span>

                            <strong
                                className={getStatusClass(
                                    booking.bookingStatus
                                )}
                            >
                                {booking.bookingStatus}
                            </strong>

                        </div>


                        <div>

                            <span
                                style={{
                                    display: "block",
                                    color: "#718096",
                                    fontSize: "13px",
                                    marginBottom: "6px"
                                }}
                            >
                                Booking Date
                            </span>

                            <strong>
                                {formatDate(
                                    booking.bookingDate
                                )}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ================= PAYMENT STATUS ================= */}

                <section
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "28px",
                        boxShadow:
                            "0 8px 24px rgba(0,0,0,0.06)"
                    }}
                >

                    <p className="booking-eyebrow">
                        PAYMENT
                    </p>


                    {/* PENDING */}

                    {booking.bookingStatus?.toLowerCase() ===
                    "pending" ? (

                        <>

                            <h2
                                style={{
                                    color: "#13294b",
                                    marginTop: "8px"
                                }}
                            >
                                Payment Pending
                            </h2>

                            <p
                                style={{
                                    color: "#718096",
                                    marginBottom: "24px"
                                }}
                            >
                                Your booking has been created.
                                Please complete the payment to confirm
                                your booking.
                            </p>


                            <button
                                className="booking-back-button"
                                onClick={handlePayNow}
                            >
                                Pay Now →
                            </button>

                        </>

                    ) : booking.bookingStatus?.toLowerCase() ===
                    "confirmed" ? (
                    <>
                    <h2
                    style={{
                        color: "#16834b",
                        marginTop: "8px"
                    }}
                    >
                        ✓ Payment Successful
                        </h2>
                        <p
                        style={{
                            color: "#718096",
                            marginBottom: "24px"
                        }}
                        >
                            Your payment has already been completed
                            and your booking is confirmed.
                            </p>
                            <button
                            type="button"
                            className="booking-back-button"
                            onClick={() =>
                                navigate(
                                    `/tenant/bookings/${booking.bookingId}/review`
                                )
                            }
                            style={{
                                border: "none",
                                cursor: "pointer"
                            }}
                            >
                                ⭐ Add Review
                                </button>
                                </>
                                ) : booking.bookingStatus?.toLowerCase() ===
                                "completed" ? (
                                <>
                                <h2
                                style={{
                                    color: "#16834b",
                                    marginTop: "8px"
                                }}
                            >
                                ✓ Payment Successful
                            </h2>

                            <p
                                style={{
                                    color: "#718096"
                                }}
                            >
                                This booking has been completed
                                successfully.
                            </p>

                        </>

                    ) : booking.bookingStatus?.toLowerCase() ===
                    "cancelled" ? (

                        <>

                            <h2
                                style={{
                                    color: "#c0392b",
                                    marginTop: "8px"
                                }}
                            >
                                Booking Cancelled
                            </h2>

                            <p
                                style={{
                                    color: "#718096"
                                }}
                            >
                                This booking has been cancelled.
                            </p>

                        </>

                    ) : (

                        <>

                            <h2>
                                Payment Status
                            </h2>

                            <p
                                style={{
                                    color: "#718096"
                                }}
                            >
                                Current booking status:
                                {" "}
                                {booking.bookingStatus}
                            </p>

                        </>

                    )}

                </section>


                {/* ================= BACK ================= */}

                <div
                    style={{
                        marginTop: "24px"
                    }}
                >

                    <Link
                        to="/tenant/bookings"
                        className="booking-back-button"
                    >
                        ← Back to My Bookings
                    </Link>

                </div>

            </main>

        </div>

    );
}

export default TenantBookingDetails;