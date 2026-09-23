import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function AddReview() {

    const { bookingId } = useParams();
    const navigate = useNavigate();

    // ==============================
    // STATE
    // ==============================

    const [reviewInfo, setReviewInfo] = useState(null);
    const [pgId, setPgId] = useState(null);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [photo, setPhoto] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    // ==============================
    // LOGGED-IN USER
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

            console.error(
                "Failed to read logged-in user:",
                error
            );

            return {
                user_name: "User",
                role: "Tenant"
            };
        }
    };


    const loggedInUser = getLoggedInUser();

    const userName = loggedInUser.user_name;

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
    // FETCH BOOKING REVIEW INFO
    // ==============================

    useEffect(() => {

        const fetchReviewInfo = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Please login again."
                    );
                }

                const response = await fetch(
                    `${API_BASE_URL}/api/tenant/reviews/booking/${bookingId}`,
                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const contentType =
                    response.headers.get("content-type");

                const data =
                    contentType?.includes("application/json")
                        ? await response.json()
                        : await response.text();

                if (!response.ok) {

                    throw new Error(
                        typeof data === "string"
                            ? data
                            : "Unable to load review information."
                    );
                }

                console.log(
                    "Review information:",
                    data
                );

                // Backend returns:
                // bookingId
                // pgId
                // bookingStatus

                if (!data.pgId) {
                    throw new Error(
                        "PG information is not available for this booking."
                    );
                }

                setReviewInfo(data);
                setPgId(data.pgId);

            } catch (error) {

                console.error(
                    "Review information error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load review information."
                );

            } finally {

                setLoading(false);
            }
        };


        if (bookingId) {
            fetchReviewInfo();
        }

    }, [bookingId]);


    // ==============================
    // STAR RATING
    // ==============================

    const handleRating = (value) => {
        setRating(value);
    };


    // ==============================
    // PHOTO
    // ==============================

    const handlePhotoChange = (e) => {

        const selectedFile =
            e.target.files?.[0];

        if (!selectedFile) {
            setPhoto(null);
            return;
        }

        setPhoto(selectedFile);
    };


    // ==============================
    // SUBMIT REVIEW
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating.");
            return;
        }

        if (!comment.trim()) {
            alert("Please write your review.");
            return;
        }

        if (!pgId) {
            alert("PG information is not available.");
            return;
        }

        try {

            setSubmitting(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login again.");
                return;
            }


            // ==============================
            // MULTIPART FORM DATA
            // ==============================

            const formData = new FormData();

            formData.append(
                "bookingId",
                bookingId
            );

            formData.append(
                "rating",
                rating
            );

            formData.append(
                "comment",
                comment.trim()
            );

            if (photo) {

                formData.append(
                    "photo",
                    photo
                );
            }


            // ==============================
            // SUBMIT TO BACKEND
            // ==============================

            const response = await fetch(
                `${API_BASE_URL}/api/pgs/${pgId}/reviews`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


            const contentType =
                response.headers.get(
                    "content-type"
                );

            const data =
                contentType?.includes(
                    "application/json"
                )
                    ? await response.json()
                    : await response.text();


            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : "Failed to submit review."
                );
            }


            console.log(
                "Review submitted:",
                data
            );


            alert(
                "Review submitted successfully!"
            );


            // Go back to booking details

            navigate("/tenant/reviews");


        } catch (error) {

            console.error(
                "Review submission error:",
                error
            );

            alert(
                error.message ||
                "Failed to submit review."
            );

        } finally {

            setSubmitting(false);
        }
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
                            <h2>PGPeekIn</h2>
                            <p>Tenant panel</p>
                        </div>

                    </div>

                </aside>


                <main className="tenant-main">

                    <div className="booking-empty">

                        <h2>
                            Loading review...
                        </h2>

                        <p>
                            Please wait.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

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

                </aside>


                <main className="tenant-main">

                    <div
                        className="booking-empty"
                        style={{
                            padding: "50px"
                        }}
                    >

                        <h2>
                            Unable to add review
                        </h2>

                        <p>
                            {error}
                        </p>

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

                    <Link to="/tenant/bookings">
                        <span>▣</span>
                        My bookings
                    </Link>

                    <Link
                        to="/tenant/reviews"
                        className="active"
                    >
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


            {/* ================= MAIN ================= */}

            <main className="tenant-main">

                {/* ================= HEADER ================= */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Add Review
                        </h1>

                        <p>
                            Share your experience with this PG.
                        </p>

                    </div>


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

                    <span
                        style={{
                            margin: "0 10px"
                        }}
                    >
                        →
                    </span>

                    <Link
                        to={`/tenant/bookings/${bookingId}`}
                        style={{
                            color: "#f57c00",
                            textDecoration: "none"
                        }}
                    >
                        Booking {bookingId}
                    </Link>

                    <span
                        style={{
                            margin: "0 10px"
                        }}
                    >
                        →
                    </span>

                    Add Review

                </div>


                {/* ================= REVIEW CARD ================= */}

                <section
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "35px",
                        boxShadow:
                            "0 8px 24px rgba(0,0,0,0.06)",
                        maxWidth: "850px",
                        margin: "0 auto"
                    }}
                >

                    <div
                        style={{
                            marginBottom: "30px"
                        }}
                    >

                        <p className="booking-eyebrow">
                            YOUR EXPERIENCE
                        </p>

                        <h2
                            style={{
                                color: "#13294b",
                                margin:
                                    "6px 0 8px"
                            }}
                        >
                            How was your stay?
                        </h2>

                        <p
                            style={{
                                color: "#718096"
                            }}
                        >
                            Your review will help other
                            tenants choose the right PG.
                        </p>

                    </div>


                    {/* ================= BOOKING INFO ================= */}

                    {reviewInfo && (

                        <div
                            style={{
                                background: "#f7f9fc",
                                padding: "18px",
                                borderRadius: "10px",
                                marginBottom: "30px"
                            }}
                        >

                            <strong
                                style={{
                                    color: "#13294b",
                                    fontSize: "16px"
                                }}
                            >
                                Booking {reviewInfo.bookingId}
                            </strong>

                            <div
                                style={{
                                    marginTop: "8px",
                                    color: "#718096",
                                    fontSize: "14px"
                                }}
                            >
                                PG ID: {reviewInfo.pgId}
                            </div>

                            <div
                                style={{
                                    marginTop: "5px",
                                    color: "#16834b",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}
                            >
                                Booking Status:{" "}
                                {reviewInfo.bookingStatus}
                            </div>

                        </div>
                    )}


                    {/* ================= RATING ================= */}

                    <div
                        style={{
                            marginBottom: "30px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#13294b",
                                marginBottom: "12px"
                            }}
                        >
                            Rating
                        </label>


                        <div
                            style={{
                                display: "flex",
                                gap: "8px"
                            }}
                        >

                            {[1, 2, 3, 4, 5].map(
                                (star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            handleRating(star)
                                        }
                                        style={{
                                            border: "none",
                                            background:
                                                "transparent",
                                            fontSize: "38px",
                                            cursor: "pointer",
                                            color:
                                                star <= rating
                                                    ? "#f57c00"
                                                    : "#d8dee8",
                                            padding: "0"
                                        }}
                                    >
                                        ★
                                    </button>

                                )
                            )}

                        </div>


                        <p
                            style={{
                                marginTop: "8px",
                                color: "#718096"
                            }}
                        >
                            {rating === 0
                                ? "Select your rating"
                                : `${rating} out of 5`}
                        </p>

                    </div>


                    {/* ================= COMMENT ================= */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <label
                            htmlFor="review-comment"
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#13294b",
                                marginBottom: "10px"
                            }}
                        >
                            Your Review
                        </label>


                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Tell us about your experience..."
                            rows="6"
                            maxLength="1000"
                            style={{
                                width: "100%",
                                padding: "14px",
                                border:
                                    "1px solid #dfe5ec",
                                borderRadius: "10px",
                                resize: "vertical",
                                fontFamily:
                                    "inherit",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing:
                                    "border-box"
                            }}
                            required
                        />


                        <div
                            style={{
                                textAlign: "right",
                                marginTop: "6px",
                                color: "#8a94a6",
                                fontSize: "12px"
                            }}
                        >
                            {comment.length}/1000
                        </div>

                    </div>


                    {/* ================= PHOTO ================= */}

                    <div
                        style={{
                            marginBottom: "30px"
                        }}
                    >

                        <label
                            htmlFor="review-photo"
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#13294b",
                                marginBottom: "10px"
                            }}
                        >
                            Add Photo

                            <span
                                style={{
                                    fontWeight: "400",
                                    color: "#8a94a6",
                                    marginLeft: "6px"
                                }}
                            >
                                (Optional)
                            </span>

                        </label>


                        <input
                            id="review-photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />


                        {photo && (

                            <p
                                style={{
                                    color: "#16834b",
                                    fontSize: "13px",
                                    marginTop: "8px"
                                }}
                            >
                                Selected: {photo.name}
                            </p>

                        )}

                    </div>


                    {/* ================= BUTTONS ================= */}

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            justifyContent: "flex-end"
                        }}
                    >

                        <Link
                            to={`/tenant/bookings/${bookingId}`}
                            className="booking-back-button"
                            style={{
                                textDecoration: "none"
                            }}
                        >
                            Cancel
                        </Link>


                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="booking-back-button"
                            style={{
                                border: "none",
                                cursor:
                                    submitting
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    submitting
                                        ? 0.7
                                        : 1
                            }}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review →"}
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AddReview;