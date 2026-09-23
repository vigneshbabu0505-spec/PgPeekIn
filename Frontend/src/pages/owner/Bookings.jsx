import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/ManageRooms.css";
import "../../styles/Bookings.css";

import { apiRequest } from "../../api/api";


function Bookings() {

  // =========================================================
  // STATE
  // =========================================================

  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // FETCH OWNER BOOKINGS
  // =========================================================

  useEffect(() => {

    fetchBookings();

  }, []);


  const fetchBookings = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/api/owner/bookings"
      );

      console.log(
        "OWNER BOOKINGS =",
        data
      );

      setBookings(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "OWNER BOOKINGS ERROR =",
        err
      );

      setError(
        err.message ||
        "Failed to load bookings"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  // =========================================================
  // GET BOOKING STATUS
  // =========================================================

  const getDisplayStatus = (booking) => {

    const status =
      booking.bookingStatus?.toLowerCase();

    // Cancelled
    if (status === "cancelled") {
      return "Cancelled";
    }

    // Completed
    if (status === "completed") {
      return "Completed";
    }

    // Pending
    if (status === "pending") {
      return "Pending";
    }

    // Confirmed
    if (status === "confirmed") {

      if (!booking.checkIn || !booking.checkOut) {
        return "Upcoming";
      }

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const checkIn =
        new Date(booking.checkIn);

      const checkOut =
        new Date(booking.checkOut);

      checkIn.setHours(0, 0, 0, 0);

      checkOut.setHours(0, 0, 0, 0);


      // Tenant is currently staying
      if (
        today >= checkIn &&
        today < checkOut
      ) {

        return "Active";

      }


      // Future booking
      if (today < checkIn) {

        return "Upcoming";

      }


      return "Completed";
    }


    return booking.bookingStatus || "Unknown";

  };


  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings =
    bookings.filter((booking) => {

      const status =
        getDisplayStatus(booking);


      if (activeTab === "All") {
        return true;
      }


      return status === activeTab;

    });


  // =========================================================
  // SUMMARY COUNTS
  // =========================================================

  const activeCount =
    bookings.filter(
      (booking) =>
        getDisplayStatus(booking) === "Active"
    ).length;


  const upcomingCount =
    bookings.filter(
      (booking) =>
        getDisplayStatus(booking) === "Upcoming"
    ).length;


  const completedCount =
    bookings.filter(
      (booking) =>
        getDisplayStatus(booking) === "Completed"
    ).length;


  // =========================================================
  // SIDEBAR
  // =========================================================

  const OwnerSidebar = () => {

    return (

      <aside className="owner-sidebar">

        {/* ================= BRAND ================= */}

        <div className="owner-brand">

          <h2>
            PGPeekIn
          </h2>

          <p>
            Owner Panel
          </p>

        </div>


        {/* ================= MENU ================= */}

        <nav className="owner-menu">

          {/* DASHBOARD */}

          <Link
            to="/owner-dashboard"
            className="owner-menu-item"
          >

            <span>
              🏠
            </span>

            Dashboard

          </Link>


          {/* MY PGs */}

          <Link
            to="/owner/my-pgs"
            className="owner-menu-item"
          >

            <span>
              🏢
            </span>

            My PGs

          </Link>


          {/* ADD PG */}

          <Link
            to="/owner/add-pg"
            className="owner-menu-item"
          >

            <span>
              ➕
            </span>

            Add PG

          </Link>


          {/* MANAGE ROOMS */}

          <Link
            to="/owner/rooms"
            className="owner-menu-item"
          >

            <span>
              🛏️
            </span>

            Manage Rooms

          </Link>


          {/* BOOKINGS - ACTIVE */}

          <Link
            to="/owner/bookings"
            className="owner-menu-item active"
          >

            <span>
              📅
            </span>

            Bookings

          </Link>


          {/* TENANTS */}

          <Link
            to="/owner/tenants"
            className="owner-menu-item"
          >

            <span>
              👥
            </span>

            Tenants

          </Link>


          {/* PROFILE */}

          <Link
            to="/owner/profile"
            className="owner-menu-item"
          >

            <span>
              👤
            </span>

            Profile

          </Link>

        </nav>


        {/* ================= LOGOUT ================= */}

        <Link
          to="/login"
          className="owner-logout"
        >

          🚪 Logout

        </Link>

      </aside>

    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="manage-rooms-layout">

        <OwnerSidebar />

        <main className="manage-rooms-main">

          <div className="rooms-header">

            <div>

              <h1>
                Bookings
              </h1>

              <p>
                Manage your PG bookings
              </p>

            </div>

          </div>


          <div className="bookings-loading">

            Loading bookings...

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="manage-rooms-layout">

        <OwnerSidebar />

        <main className="manage-rooms-main">

          <div className="rooms-header">

            <div>

              <h1>
                Bookings
              </h1>

              <p>
                Manage your PG bookings
              </p>

            </div>

          </div>


          <div className="bookings-error">

            <p>
              {error}
            </p>


            <button
              type="button"
              onClick={fetchBookings}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="manage-rooms-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <OwnerSidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="manage-rooms-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="rooms-header">

          <div>

            <h1>
              Bookings
            </h1>

            <p>
              Manage your PG bookings
            </p>

          </div>

        </div>


        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <section className="booking-summary">


          {/* ACTIVE */}

          <div className="summary-card">

            <h3>
              Active
            </h3>

            <span>
              {activeCount}
            </span>

          </div>


          {/* UPCOMING */}

          <div className="summary-card">

            <h3>
              Upcoming
            </h3>

            <span>
              {upcomingCount}
            </span>

          </div>


          {/* COMPLETED */}

          <div className="summary-card">

            <h3>
              Completed
            </h3>

            <span>
              {completedCount}
            </span>

          </div>

        </section>


        {/* ===================================================
            FILTER TABS
        =================================================== */}

        <div className="booking-tabs">


          {/* ALL */}

          <button
            type="button"
            className={
              activeTab === "All"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("All")
            }
          >
            All
          </button>


          {/* ACTIVE */}

          <button
            type="button"
            className={
              activeTab === "Active"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("Active")
            }
          >
            Active
          </button>


          {/* UPCOMING */}

          <button
            type="button"
            className={
              activeTab === "Upcoming"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("Upcoming")
            }
          >
            Upcoming
          </button>


          {/* COMPLETED */}

          <button
            type="button"
            className={
              activeTab === "Completed"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("Completed")
            }
          >
            Completed
          </button>


          {/* PENDING */}

          <button
            type="button"
            className={
              activeTab === "Pending"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("Pending")
            }
          >
            Pending
          </button>


          {/* CANCELLED */}

          <button
            type="button"
            className={
              activeTab === "Cancelled"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("Cancelled")
            }
          >
            Cancelled
          </button>

        </div>


        {/* ===================================================
            BOOKINGS LIST
        =================================================== */}

        <div className="bookings-list">


          {/* NO BOOKINGS */}

          {filteredBookings.length === 0 ? (

            <div className="no-bookings">

              <h3>
                No bookings found
              </h3>

              <p>
                There are no bookings in this category.
              </p>

            </div>

          ) : (

            filteredBookings.map(
              (booking) => {

                const displayStatus =
                  getDisplayStatus(
                    booking
                  );


                return (

                  <div
                    className="booking-card"
                    key={
                      booking.bookingId
                    }
                  >


                    {/* =========================================
                        CARD HEADER
                    ========================================= */}

                    <div className="booking-card-header">

                      <div>

                        <h3>
                          Booking #
                          {booking.bookingId}
                        </h3>

                        <p>
                          Created{" "}
                          {formatDate(
                            booking.bookingDate
                          )}
                        </p>

                      </div>


                      {/* STATUS */}

                      <span
                        className={
                          `booking-status ${
                            displayStatus
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`
                        }
                      >
                        {displayStatus}
                      </span>

                    </div>


                    {/* =========================================
                        BOOKING INFORMATION
                    ========================================= */}

                    <div className="booking-card-content">


                      {/* TENANT */}

                      <div className="booking-info">

                        <span className="info-label">
                          Tenant
                        </span>

                        <strong>
                          {
                            booking.tenantName ||
                            "-"
                          }
                        </strong>

                        <small>
                          {
                            booking.tenantPhone ||
                            "-"
                          }
                        </small>

                      </div>


                      {/* PG */}

                      <div className="booking-info">

                        <span className="info-label">
                          PG
                        </span>

                        <strong>
                          {
                            booking.pgName ||
                            "-"
                          }
                        </strong>

                        <small>

                          {
                            booking.pgArea ||
                            "-"
                          }

                          {booking.pgCity
                            ? `, ${booking.pgCity}`
                            : ""}

                        </small>

                      </div>


                      {/* ROOM */}

                      <div className="booking-info">

                        <span className="info-label">
                          Room
                        </span>

                        <strong>
                          {
                            booking.roomNo ||
                            "-"
                          }
                        </strong>

                        <small>

                          {
                            booking.sharingType
                              ? `${booking.sharingType} Sharing`
                              : "-"
                          }

                        </small>

                      </div>


                      {/* RENT */}

                      <div className="booking-info">

                        <span className="info-label">
                          Rent
                        </span>

                        <strong>

                          {booking.monthlyRent !==
                            null &&
                          booking.monthlyRent !==
                            undefined
                            ? `₹${Number(
                                booking.monthlyRent
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "-"}

                        </strong>

                        <small>
                          per month
                        </small>

                      </div>

                    </div>


                    {/* =========================================
                        DATES
                    ========================================= */}

                    <div className="booking-dates">


                      {/* CHECK IN */}

                      <div>

                        <span>
                          Check-in
                        </span>

                        <strong>
                          {
                            formatDate(
                              booking.checkIn
                            )
                          }
                        </strong>

                      </div>


                      {/* CHECK OUT */}

                      <div>

                        <span>
                          Check-out
                        </span>

                        <strong>
                          {
                            formatDate(
                              booking.checkOut
                            )
                          }
                        </strong>

                      </div>


                      {/* SLOT */}

                      <div>

                        <span>
                          Slot
                        </span>

                        <strong>

                          {
                            booking.slotNo
                              ? `Slot ${booking.slotNo}`
                              : "-"
                          }

                        </strong>

                      </div>

                    </div>


                    {/* =========================================
                        FOOTER
                    ========================================= */}

                    <div className="booking-card-footer">

                      <Link
                        to={`/owner/bookings/${booking.bookingId}`}
                        className="view-booking-btn"
                      >
                        View
                      </Link>

                    </div>

                  </div>

                );

              }
            )

          )}

        </div>

      </main>

    </div>

  );

}


export default Bookings;