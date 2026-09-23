import { useEffect, useState } from "react";

import {
    Link,
    useParams,
    useNavigate
} from "react-router-dom";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

import { apiRequest } from "../../api/api";


function Payment() {

    const { bookingId } = useParams();

    const navigate = useNavigate();

    const [paymentMode, setPaymentMode] = useState("");

    const [paymentDetails, setPaymentDetails] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [paying, setPaying] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOGGED-IN USER
    // ==========================================

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
            ? userName
                .charAt(0)
                .toUpperCase()
            : "U";


    const userRole =
        loggedInUser.role
            ? loggedInUser.role
                .charAt(0)
                .toUpperCase() +
              loggedInUser.role.slice(1)
            : "Tenant";


    // ==========================================
    // FETCH PAYMENT DETAILS
    // ==========================================

    useEffect(() => {

        const fetchPaymentDetails =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    if (!bookingId) {

                        throw new Error(
                            "Booking ID is missing."
                        );

                    }


                    console.log(
                        "Fetching payment details for booking:",
                        bookingId
                    );


                    // ==================================
                    // GET PAYMENT DETAILS FROM BACKEND
                    // ==================================

                    const data =
                        await apiRequest(
                            `/api/tenant/payment-details/${bookingId}`
                        );


                    console.log(
                        "Payment details received:",
                        data
                    );


                    if (!data) {

                        throw new Error(
                            "Payment details not found."
                        );

                    }


                    setPaymentDetails(data);

                } catch (err) {

                    console.error(
                        "Error loading payment details:",
                        err
                    );

                    setError(
                        err.message ||
                        "Unable to load payment details."
                    );

                } finally {

                    setLoading(false);

                }

            };


        if (bookingId) {

            fetchPaymentDetails();

        } else {

            setLoading(false);

            setError(
                "Booking ID is missing."
            );

        }

    }, [bookingId]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {

            return "Not selected";

        }


        const [year, month, day] =
            date.split("-");


        return `${day}-${month}-${year}`;

    };


    // ==========================================
    // PAYMENT
    // ==========================================

    const handlePayment = async () => {

        if (!paymentMode) {

            alert(
                "Please select a payment mode"
            );

            return;

        }


        if (!paymentDetails) {

            alert(
                "Payment details are not available"
            );

            return;

        }


        try {

            setPaying(true);


            // ==================================
            // PAYMENT DATA
            // ==================================

            const paymentData = {

                bookingId:
                    paymentDetails.bookingId,

                paymentMethod:
                    paymentMode,

                amount:
                    paymentDetails.dailyRent,

                status:
                    "paid"

            };


            console.log(
                "Sending payment:",
                paymentData
            );


            // ==================================
            // SEND PAYMENT TO BACKEND
            // ==================================

            const data =
                await apiRequest(
                    "/PgPeekIn/payments",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                paymentData
                            )
                    }
                );


            console.log(
                "Payment successful:",
                data
            );


            // ==================================
            // PAYMENT SUCCESS
            // ==================================

            navigate(
                "/tenant/payment-success",
                {
                    state: {

                        bookingId:
                            paymentDetails.bookingId,

                        pg: {

                            PG_id:
                                paymentDetails.pgId,

                            Pg_name:
                                paymentDetails.pgName

                        },

                        room: {

                            roomNo:
                                paymentDetails.roomNo,

                            sharingType:
                                paymentDetails.sharingType,

                            category:
                                paymentDetails.category,

                            dailyRent:
                                paymentDetails.dailyRent,

                            monthlyRent:
                                paymentDetails.monthlyRent

                        },

                        checkInDate:
                            paymentDetails.checkInDate,

                        checkOutDate:
                            paymentDetails.checkOutDate,

                        paymentMode:
                            paymentMode,

                        payment:
                            data,

                        amountPaid:
                            data.amount,

                        transactionId:
                            data.paymentId

                    }
                }
            );


        } catch (err) {

            console.error(
                "Payment error:",
                err
            );


            alert(
                err.message ||
                "Payment failed"
            );


        } finally {

            setPaying(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

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

                        <h2>
                            Loading payment details...
                        </h2>

                        <p>
                            Please wait while we fetch your booking.
                        </p>

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !paymentDetails) {

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

                        <h2>
                            Unable to load payment details
                        </h2>

                        <p>
                            {error ||
                                "Payment details not found"}
                        </p>

                        <Link
                            to="/tenant/bookings"
                            className="booking-back-button"
                        >
                            Back to My Bookings
                        </Link>

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // PAYMENT PAGE
    // ==========================================

    return (

        <div className="tenant-page">


            {/* ======================================
                SIDEBAR
            ====================================== */}

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


            {/* ======================================
                MAIN
            ====================================== */}

            <main className="tenant-main">


                {/* ==================================
                    HEADER
                ================================== */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Payment
                        </h1>

                        <p>
                            Complete your payment to
                            confirm your booking.
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


                {/* ==================================
                    BREADCRUMB
                ================================== */}

                <div className="booking-breadcrumb">

                    <Link to="/tenant/bookings">
                        My Bookings
                    </Link>

                    <span>
                        →
                    </span>

                    <Link
                        to={`/tenant/bookings/${paymentDetails.bookingId}`}
                    >
                        Booking #{paymentDetails.bookingId}
                    </Link>

                    <span>
                        →
                    </span>

                    <strong>
                        Payment
                    </strong>

                </div>


                {/* ==================================
                    PAYMENT CONTENT
                ================================== */}

                <section className="payment-page-layout">


                    {/* ==================================
                        LEFT
                    ================================== */}

                    <div className="payment-main-content">


                        {/* BOOKING SUMMARY */}

                        <div className="payment-card">

                            <p className="booking-eyebrow">
                                BOOKING SUMMARY
                            </p>


                            <h2>
                                {paymentDetails.pgName}
                            </h2>


                            <div className="payment-details">


                                <div>

                                    <span>
                                        Room No
                                    </span>

                                    <strong>
                                        {paymentDetails.roomNo}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Sharing Type
                                    </span>

                                    <strong>

                                        {paymentDetails.sharingType}
                                        {" "}
                                        Sharing

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {paymentDetails.category}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Check-in
                                    </span>

                                    <strong>

                                        {formatDate(
                                            paymentDetails.checkInDate
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Check-out
                                    </span>

                                    <strong>

                                        {formatDate(
                                            paymentDetails.checkOutDate
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Booking ID
                                    </span>

                                    <strong>

                                        #{paymentDetails.bookingId}

                                    </strong>

                                </div>


                            </div>

                        </div>


                        {/* PAYMENT MODE */}

                        <div className="payment-card">

                            <p className="booking-eyebrow">
                                PAYMENT
                            </p>


                            <h2>
                                Select Payment Mode
                            </h2>


                            <div className="payment-options">


                                {/* UPI */}

                                <label>

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={
                                            paymentMode ===
                                            "UPI"
                                        }
                                        onChange={(e) =>
                                            setPaymentMode(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        UPI
                                    </span>

                                </label>


                                {/* CARD */}

                                <label>

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Card"
                                        checked={
                                            paymentMode ===
                                            "Card"
                                        }
                                        onChange={(e) =>
                                            setPaymentMode(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        Credit / Debit Card
                                    </span>

                                </label>


                                {/* NET BANKING */}

                                <label>

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Net Banking"
                                        checked={
                                            paymentMode ===
                                            "Net Banking"
                                        }
                                        onChange={(e) =>
                                            setPaymentMode(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        Net Banking
                                    </span>

                                </label>


                            </div>

                        </div>


                    </div>


                    {/* ==================================
                        RIGHT
                    ================================== */}

                    <aside className="payment-summary-card">

                        <p className="booking-eyebrow">
                            PAYMENT SUMMARY
                        </p>


                        <h2>
                            Total Amount
                        </h2>


                        <div className="payment-summary-amount">

                            ₹
                            {paymentDetails.dailyRent}

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                PG
                            </span>

                            <strong>
                                {paymentDetails.pgName}
                            </strong>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Room
                            </span>

                            <strong>
                                {paymentDetails.roomNo}
                            </strong>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Daily Rent
                            </span>

                            <strong>

                                ₹
                                {paymentDetails.dailyRent}

                            </strong>

                        </div>


                        <button
                            className="pay-now-btn"
                            onClick={handlePayment}
                            disabled={paying}
                        >

                            {paying
                                ? "Processing..."
                                : "Pay Now →"}

                        </button>


                    </aside>


                </section>


            </main>

        </div>
    );

}


export default Payment;