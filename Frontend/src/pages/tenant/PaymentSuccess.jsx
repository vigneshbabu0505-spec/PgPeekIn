import { Link, useLocation } from "react-router-dom";

import "../../styles/Tenant.css";

import logo from "../../assets/pgpeekin-logo.png";


function PaymentSuccess() {

    const location = useLocation();


    const {
        bookingId,
        pg,
        room,
        checkInDate,
        checkOutDate,
        paymentMode,
        payment,
        amountPaid,
        transactionId
    } = location.state || {};


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


    const loggedInUser =
        getLoggedInUser();


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
    // PAYMENT AMOUNT
    // ==============================

    const finalAmount =
        amountPaid ??
        payment?.amount ??
        room?.dailyRent ??
        0;


    // ==============================
    // MISSING DATA
    // ==============================

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

                    <div className="payment-success-card">

                        <h2>
                            Payment details not found
                        </h2>

                        <p>
                            Your payment may have been completed,
                            but the payment details are no longer
                            available on this page.
                        </p>

                        <Link
                            to="/tenant/bookings"
                            className="success-primary-button"
                        >
                            Go to My Bookings
                        </Link>

                    </div>

                </main>

            </div>

        );

    }


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
                            Payment Successful
                        </h1>

                        <p>
                            Your booking has been successfully confirmed.
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


                {/* ================= SUCCESS ================= */}

                <div className="payment-success-wrapper">

                    <div className="payment-success-card">


                        {/* SUCCESS ICON */}

                        <div className="payment-success-icon">

                            ✓

                        </div>


                        <h1>
                            Payment Successful!
                        </h1>


                        <p className="payment-success-message">

                            Your booking has been successfully confirmed.

                        </p>


                        {/* ================= BOOKING DETAILS ================= */}

                        <div className="success-booking-details">

                            <h2>
                                Booking Details
                            </h2>


                            {/* BOOKING ID */}

                            <div className="success-detail-row">

                                <span>
                                    Booking ID
                                </span>

                                <strong>
                                    #{bookingId}
                                </strong>

                            </div>


                            {/* PG */}

                            <div className="success-detail-row">

                                <span>
                                    PG Name
                                </span>

                                <strong>
                                    {pg.Pg_name ||
                                     pg.pgName ||
                                     pg.pgname ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* ROOM */}

                            <div className="success-detail-row">

                                <span>
                                    Room No
                                </span>

                                <strong>
                                    {room.roomNo ||
                                     room.Room_no ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* SHARING */}

                            <div className="success-detail-row">

                                <span>
                                    Sharing Type
                                </span>

                                <strong>

                                    {room.sharingType ||
                                     room.sharing_type ||
                                     "Not available"}

                                    {" "}
                                    Sharing

                                </strong>

                            </div>


                            {/* CATEGORY */}

                            <div className="success-detail-row">

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {room.category ||
                                     room.Category ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* CHECK IN */}

                            <div className="success-detail-row">

                                <span>
                                    Check-in
                                </span>

                                <strong>
                                    {checkInDate ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* CHECK OUT */}

                            <div className="success-detail-row">

                                <span>
                                    Check-out
                                </span>

                                <strong>
                                    {checkOutDate ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* PAYMENT MODE */}

                            <div className="success-detail-row">

                                <span>
                                    Payment Mode
                                </span>

                                <strong>
                                    {paymentMode ||
                                     payment?.paymentMethod ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* AMOUNT */}

                            <div className="success-detail-row">

                                <span>
                                    Amount Paid
                                </span>

                                <strong>
                                    ₹{finalAmount}
                                </strong>

                            </div>


                            {/* TRANSACTION */}

                            <div className="success-detail-row">

                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    {transactionId ||
                                     payment?.paymentId ||
                                     "Not available"}
                                </strong>

                            </div>


                            {/* STATUS */}

                            <div className="success-detail-row">

                                <span>
                                    Status
                                </span>

                                <strong className="success-status">

                                    PAID

                                </strong>

                            </div>


                        </div>


                        {/* ================= BUTTONS ================= */}

                        <div className="success-buttons">

                            <Link
                                to="/tenant/bookings"
                                className="success-primary-button"
                            >
                                View My Bookings
                            </Link>


                            <Link
                                to="/tenant-dashboard"
                                className="success-secondary-button"
                            >
                                Back to Dashboard
                            </Link>

                        </div>


                    </div>

                </div>

            </main>

        </div>

    );

}

export default PaymentSuccess;