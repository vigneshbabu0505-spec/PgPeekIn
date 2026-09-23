import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/Tenant.css";

import logo from "../../assets/pgpeekin-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function TenantReviews() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    name: "User",
    role: "Tenant account"
  });

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  useEffect(() => {

    try {

      const storedUser = localStorage.getItem("user");

      if (storedUser) {

        const parsedUser = JSON.parse(storedUser);

        const name =
          parsedUser.user_name ||
          parsedUser.userName ||
          parsedUser.name ||
          "User";

        setUser({
          name: name,
          role:
            parsedUser.role === "tenant"
              ? "Tenant account"
              : parsedUser.role || "Tenant account"
        });
      }

    } catch (err) {

      console.error("Unable to read logged-in user", err);

    }

  }, []);


  // ==========================================
  // FETCH MY REVIEWS
  // ==========================================

  useEffect(() => {

    const fetchMyReviews = async () => {

      try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/tenant/reviews/my`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
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

          if (response.status === 401 ||
              response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return;
          }

          throw new Error(
            typeof data === "string"
              ? data
              : "Unable to fetch reviews"
          );
        }

        setReviews(Array.isArray(data) ? data : []);

      } catch (err) {

        console.error("Error fetching reviews:", err);

        setError(
          err.message || "Unable to load your reviews."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchMyReviews();

  }, []);


  // ==========================================
  // STAR DISPLAY
  // ==========================================

  const renderStars = (rating) => {

    return (
      <div className="tenant-review-stars">

        {[1, 2, 3, 4, 5].map((star) => (

          <span
            key={star}
            className={
              star <= rating
                ? "review-star filled"
                : "review-star"
            }
          >
            ★
          </span>

        ))}

        <span className="review-rating-number">
          {rating}/5
        </span>

      </div>
    );
  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };


  // ==========================================
  // MAIN UI
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


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="tenant-main">

        {/* HEADER */}

        <header className="tenant-header">

          <div>

            <h1>
              My Reviews
            </h1>

            <p>
              View the reviews you have submitted for PGs.
            </p>

          </div>


          {/* ACTUAL LOGGED-IN USER */}

          <div className="tenant-user">

            <div className="tenant-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>

              <strong>
                {user.name}
              </strong>

              <span>
                {user.role}
              </span>

            </div>

          </div>

        </header>


        {/* ======================================
            REVIEW SECTION
        ====================================== */}

        <section className="booking-history">

          <div className="booking-history-header">

            <div>

              <p className="booking-eyebrow">
                REVIEW HISTORY
              </p>

              <h2>
                Your reviews
              </h2>

            </div>

          </div>


          {/* ====================================
              LOADING
          ==================================== */}

          {loading && (

            <div className="booking-empty">

              <div className="booking-empty-icon">
                ⟳
              </div>

              <h2>
                Loading your reviews...
              </h2>

              <p>
                Please wait while we fetch your review history.
              </p>

            </div>

          )}


          {/* ====================================
              ERROR
          ==================================== */}

          {!loading && error && (

            <div className="booking-empty">

              <div className="booking-empty-icon">
                !
              </div>

              <h2>
                Unable to load reviews
              </h2>

              <p>
                {error}
              </p>

              <Link
                to="/tenant-dashboard"
                className="booking-back-button"
              >
                Back to Dashboard
              </Link>

            </div>

          )}


          {/* ====================================
              EMPTY STATE
          ==================================== */}

          {!loading &&
           !error &&
           reviews.length === 0 && (

            <div className="booking-empty">

              <div className="booking-empty-icon">
                ☆
              </div>

              <h2>
                No reviews yet
              </h2>

              <p>
                You haven't submitted any reviews yet.
                After staying at a PG, you can share your
                experience here.
              </p>

              <Link
                to="/tenant/bookings"
                className="booking-back-button"
              >
                View My Bookings
              </Link>

            </div>

          )}


          {/* ====================================
              REVIEW LIST
          ==================================== */}

          {!loading &&
           !error &&
           reviews.length > 0 && (

            <div className="tenant-reviews-list">

              {reviews.map((review) => (

                <div
                  className="tenant-review-card"
                  key={review.reviewId}
                >

                  {/* REVIEW HEADER */}

                  <div className="tenant-review-card-header">

                    <div>

                      <p className="review-pg-label">
                        PG
                      </p>

                      <h3>
                        {review.pgName || "PG"}
                      </h3>

                    </div>

                    <div className="review-date">
                      {formatDate(review.reviewDate)}
                    </div>

                  </div>


                  {/* RATING */}

                  {renderStars(review.rating)}


                  {/* COMMENT */}

                  <div className="tenant-review-comment">

                    <p>
                      "{review.comment}"
                    </p>

                  </div>


                  {/* DETAILS */}

                  <div className="tenant-review-details">

                    <span>
                      Booking ID: #{review.bookingId}
                    </span>

                    <span>
                      PG ID: #{review.pgId}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default TenantReviews;