import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function PGDetails() {

  // =========================================================
  // SELECTED PG ID
  // Example:
  // /tenant/pg/34
  //
  // id = 34
  // =========================================================

  const { id } = useParams();


  // =========================================================
  // STATES
  // =========================================================

  const [pg, setPg] = useState(null);

  const [pgPhotos, setPgPhotos] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [photoLoading, setPhotoLoading] = useState(true);

  const [reviewLoading, setReviewLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // GET JWT TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // =========================================================
  // FETCH SELECTED PG
  // =========================================================

  useEffect(() => {

    const fetchPG = async () => {

      try {

        setLoading(true);

        setError("");

        const token = getToken();

        console.log(
          "Fetching selected PG:",
          id
        );


        const response = await fetch(
          `${API_BASE_URL}/api/tenant/pg/${id}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            `Failed to fetch PG: ${response.status}`
          );

        }


        const data = await response.json();


        console.log(
          "Selected PG received:",
          data
        );


        setPg(data);


      } catch (error) {

        console.error(
          "Error loading PG:",
          error
        );

        setError(
          error.message ||
          "Failed to load PG details"
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      fetchPG();

    }

  }, [id]);


  // =========================================================
  // FETCH PG PHOTOS
  // =========================================================

  useEffect(() => {

    const fetchPGPhotos = async () => {

      try {

        setPhotoLoading(true);

        const token = getToken();


        console.log(
          "Fetching photos for PG:",
          id
        );


        const response = await fetch(
          `${API_BASE_URL}/api/tenant/pg/${id}/photos`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            `Failed to fetch PG photos: ${response.status}`
          );

        }


        const data = await response.json();


        console.log(
          "PG photos received:",
          data
        );


        setPgPhotos(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Error loading PG photos:",
          error
        );

        setPgPhotos([]);

      } finally {

        setPhotoLoading(false);

      }

    };


    if (id) {

      fetchPGPhotos();

    }

  }, [id]);


  // =========================================================
  // FETCH REVIEWS
  // =========================================================
  //
  // Your SecurityConfigure already has:
  //
  // GET /api/pgs/*/reviews -> permitAll
  //
  // =========================================================
useEffect(() => {

  const fetchReviews = async () => {

    try {

      setReviewLoading(true);

      const token = getToken();

      console.log(
        "Fetching reviews for PG:",
        id
      );

      const response = await fetch(
        `${API_BASE_URL}/api/pgs/${id}/reviews`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      if (!response.ok) {

        throw new Error(
          `Failed to fetch reviews: ${response.status}`
        );

      }

      const data = await response.json();

      console.log(
        "Reviews received:",
        data
      );


      // GET PHOTO FOR EACH REVIEW
      const reviewsWithPhotos = await Promise.all(

        data.map(async (review) => {

          try {

            const photoResponse = await fetch(
              `${API_BASE_URL}/api/pgs/${id}/reviews/${review.reviewId}/photo`,
              {
                method: "GET",

                headers: {
                  "Content-Type": "application/json",

                  ...(token && {
                    Authorization: `Bearer ${token}`,
                  }),
                },
              }
            );


            const photos = photoResponse.ok
              ? await photoResponse.json()
              : [];


            return {
              ...review,

              photoUrl:
                photos.length > 0
                  ? photos[0].photoPath
                  : null,
            };

          } catch (photoError) {

            console.error(
              "Error loading review photo:",
              photoError
            );

            return {
              ...review,
              photoUrl: null,
            };

          }

        })

      );


      console.log(
        "Reviews with photos:",
        reviewsWithPhotos
      );


      setReviews(
        Array.isArray(reviewsWithPhotos)
          ? reviewsWithPhotos
          : []
      );


    } catch (error) {

      console.error(
        "Error loading reviews:",
        error
      );

      setReviews([]);

    } finally {

      setReviewLoading(false);

    }

  };


  if (id) {

    fetchReviews();

  }

}, [id]);

  // =========================================================
  // LOADING PG
  // =========================================================

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

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >

            <h2>
              Loading PG details...
            </h2>

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // PG LOAD ERROR
  // =========================================================

  if (error || !pg) {

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

          <nav className="tenant-menu">

            <Link to="/tenant-dashboard">

              <span>
                ⌂
              </span>

              Dashboard

            </Link>


            <Link
              to="/tenant/search-pg"
              className="active"
            >

              <span>
                ⌕
              </span>

              Search PG

            </Link>


            <Link to="/tenant/bookings">

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

        </aside>


        <main className="tenant-main">

          <div
            style={{
              padding: "50px",
            }}
          >

            <h2>
              Unable to load PG
            </h2>

            <p>
              {error || "PG not found"}
            </p>

            <br />

            <Link to="/tenant/search-pg">
              ← Back to Search PG
            </Link>

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // MAP BACKEND PG MODEL
  // =========================================================
  //
  // Backend:
  //
  // pgid
  // pgname
  // userid
  // pgtype
  // pgbranch
  // pgphnno
  // street
  // area
  // city
  // pincode
  //
  // =========================================================

  const pgId = pg.pgid;

  const pgName = pg.pgname;

  const pgType = pg.pgtype;

  const pgBranch = pg.pgbranch;

  const pgPhone = pg.pgphnno;

  const pgStreet = pg.street;

  const pgArea = pg.area;

  const pgCity = pg.city;

  const pgPincode = pg.pincode;


  // =========================================================
  // AVERAGE RATING
  // =========================================================

  const validRatings = reviews.filter(
    (review) =>
      review.rating !== null &&
      review.rating !== undefined
  );


  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce(
          (sum, review) =>
            sum + Number(review.rating),
          0
        ) / validRatings.length
      : 0;


  return (

    <div className="tenant-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

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


          <Link
            to="/tenant/search-pg"
            className="active"
          >

            <span>
              ⌕
            </span>

            Search PG

          </Link>


          <Link to="/tenant/bookings">

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


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="tenant-main">

        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="tenant-header">

          <div>

            <h1>
              PG Details
            </h1>

            <p>
              Explore the property, reviews and feedback before
              choosing your room.
            </p>

          </div>


          <div className="tenant-user">

            <div className="tenant-avatar">
              D
            </div>

            <div>

              <strong>
                Divya
              </strong>

              <span>
                Tenant account
              </span>

            </div>

          </div>

        </header>


        {/* ===================================================
            BREADCRUMB
            =================================================== */}

        <div className="pg-details-breadcrumb">

          <Link to="/tenant/search-pg">
            Search PG
          </Link>

          <span>
            →
          </span>

          <strong>
            {pgName}
          </strong>

        </div>


        {/* ===================================================
            HERO
            =================================================== */}

        <section className="pg-details-hero">

          <div className="pg-details-main-info">

            <div className="pg-details-status">

              <span></span>

              Available

            </div>


            <h2>
              {pgName}
            </h2>


            <p className="pg-details-location">

              ⌖ {pgArea}, {pgCity}

            </p>


            <div className="pg-details-type">

              <span>
                {pgType}
              </span>

              <span>
                {pgBranch}
              </span>

            </div>

          </div>


          <div className="pg-rating-summary">

            <div className="rating-number">

              {averageRating.toFixed(1)}

            </div>


            <div>

              <div className="rating-stars">

                ★★★★★

              </div>


              <p>

                {reviews.length} tenant reviews

              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            PROPERTY GALLERY
            =================================================== */}

        <section className="pg-details-section">

          <div className="section-heading">

            <div>

              <p className="section-eyebrow">
                PROPERTY GALLERY
              </p>

              <h2>
                Take a look around
              </h2>

            </div>


            <span>

              {photoLoading
                ? "Loading..."
                : `${pgPhotos.length} photos`
              }

            </span>

          </div>


          <div className="pg-photo-gallery">

            {/* =================================================
                LOADING
                ================================================= */}

            {photoLoading && (

              <div className="pg-photo-placeholder">

                <span>
                  PG
                </span>

                <small>
                  Loading property photos...
                </small>

              </div>

            )}


            {/* =================================================
                NO PHOTOS
                ================================================= */}

            {!photoLoading &&
              pgPhotos.length === 0 && (

                <div className="pg-photo-placeholder">

                  <span>
                    PG
                  </span>

                  <small>
                    No property photos available
                  </small>

                </div>

              )}


            {/* =================================================
                REAL OWNER-UPLOADED PHOTOS
                ================================================= */}

            {!photoLoading &&
              pgPhotos.length > 0 &&
              pgPhotos.map((photo, index) => (

                <div
                  className={`pg-gallery-photo pg-gallery-photo-${
                    index + 1
                  }`}
                  key={
                    photo.photoid ||
                    index
                  }
                >

                  {photo.photoPath ? (

                    <img
                      src={photo.photoPath}
                      alt={`${pgName} ${index + 1}`}
                    />

                  ) : (

                    <div className="pg-photo-placeholder">

                      <span>
                        PG
                      </span>

                      <small>
                        Property Photo
                      </small>

                    </div>

                  )}

                </div>

              ))}

          </div>

        </section>


        {/* ===================================================
            PROPERTY INFORMATION
            =================================================== */}

        <section className="pg-details-info-grid">


          {/* LOCATION */}

          <div className="pg-info-card">

            <div className="info-card-icon">
              ⌖
            </div>

            <div>

              <span>
                Location
              </span>

              <strong>
                {pgStreet}
              </strong>

              <p>
                {pgArea}, {pgCity} - {pgPincode}
              </p>

            </div>

          </div>


          {/* CONTACT */}

          <div className="pg-info-card">

            <div className="info-card-icon">
              ☎
            </div>

            <div>

              <span>
                Contact
              </span>

              <strong>
                {pgPhone}
              </strong>

              <p>
                Property contact number
              </p>

            </div>

          </div>


          {/* PG TYPE */}

          <div className="pg-info-card">

            <div className="info-card-icon">
              ⌂
            </div>

            <div>

              <span>
                PG Type
              </span>

              <strong>
                {pgType}
              </strong>

              <p>
                {pgBranch} branch
              </p>

            </div>

          </div>


          {/* STATUS */}

          <div className="pg-info-card">

            <div className="info-card-icon">
              ●
            </div>

            <div>

              <span>
                Status
              </span>

              <strong>
                Available
              </strong>

              <p>
                Check rooms for date availability
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
    REVIEWS
    =================================================== */}

<section className="pg-details-section">

  <div className="section-heading">

    <div>

      <p className="section-eyebrow">
        TENANT FEEDBACK
      </p>

      <h2>
        What previous tenants say
      </h2>

    </div>

    <div className="review-total">

      <strong>
        {averageRating.toFixed(1)}
      </strong>

      <span>
        ★★★★★
      </span>

    </div>

  </div>


  <div className="review-list">

    {/* LOADING */}

    {reviewLoading && (
      <p>
        Loading reviews...
      </p>
    )}


    {/* NO REVIEWS */}

    {!reviewLoading && reviews.length === 0 && (
      <p>
        No reviews available for this PG yet.
      </p>
    )}


    {/* REAL DATABASE REVIEWS */}

    {!reviewLoading &&
      reviews.map((review, index) => {

        const rating = Math.min(
          5,
          Math.max(0, Number(review.rating) || 0)
        );

        const userId = review.userId;

        const comment =
          review.comment?.trim() ||
          "No comment provided.";

        const reviewDate = review.reviewDate
          ? new Date(review.reviewDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Date unavailable";


        return (

          <article
            className="tenant-review-card"
            key={review.reviewId || index}
          >

            <div className="review-top">

              {/* REVIEWER */}

              <div className="reviewer">

                <div className="reviewer-avatar">
                  T
                </div>

                <div>

                  <strong>
                    Tenant #{userId}
                  </strong>

                  <span>
                    Review submitted on {reviewDate}
                  </span>

                </div>

              </div>


              {/* RATING */}

              <div className="review-rating">

                {"★".repeat(rating)}

                {"☆".repeat(5 - rating)}

              </div>

            </div>


            {/* COMMENT */}

            <p className="review-comment">
              "{comment}"
            </p>
{review.photoUrl && (
  <img
    src={review.photoUrl}
    alt="Review"
    style={{
      width: "200px",
      height: "150px",
      objectFit: "cover",
      borderRadius: "10px",
      marginTop: "12px",
    }}
  />
)}

          </article>

        );

      })}

  </div>

</section>


        {/* ===================================================
            CTA
            =================================================== */}

        <section className="pg-room-cta">

          <div>

            <p>
              Ready to find your room?
            </p>

            <h2>
              Check rooms & availability
            </h2>

            <span>
              Choose sharing type, AC/Non-AC and your
              check-in & check-out dates.
            </span>

          </div>


          <Link
            to={`/tenant/pg/${pgId}/rooms`}
            className="pg-room-cta-button"
          >

            View Available Rooms

            <span>
              →
            </span>

          </Link>

        </section>


      </main>

    </div>

  );
}

export default PGDetails;