import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function TenantDashboard() {

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState("");

  // --------------------------------------------------
  // GET USER NAME
  // --------------------------------------------------

  const getUserName = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return "Tenant";
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    // Never use password as username
    if (parsedUser.name) {
      return parsedUser.name;
    }

    if (parsedUser.userName) {
      return parsedUser.userName;
    }

    if (parsedUser.username) {
      return parsedUser.username;
    }

    if (parsedUser.fullName) {
      return parsedUser.fullName;
    }

    if (parsedUser.user_name) {
      return parsedUser.user_name;
    }

    // If only email is available
    if (parsedUser.email) {
      return parsedUser.email.split("@")[0];
    }

    return "Tenant";

  } catch (error) {
    console.error("User data parsing error:", error);
    return "Tenant";
  }
};

  const userName = getUserName();

  // --------------------------------------------------
  // LOAD DASHBOARD
  // --------------------------------------------------

  useEffect(() => {

    const loadDashboard = async () => {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        const response = await fetch(
          API_BASE_URL + "/api/bookings/my/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json"
            }
          }
        );

        // --------------------------------------------------
        // NO BOOKING
        // --------------------------------------------------

        if (response.status === 204) {

          setBooking(null);
          setPayments([]);
          setLoading(false);

          return;
        }

        // --------------------------------------------------
        // UNAUTHORIZED
        // --------------------------------------------------

        if (response.status === 401 || response.status === 403) {

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

          return;
        }

        // --------------------------------------------------
        // OTHER ERROR
        // --------------------------------------------------

        if (!response.ok) {

          throw new Error(
            "Failed to load dashboard"
          );
        }

        const data = await response.json();

        setBooking(data);

        // --------------------------------------------------
        // LOAD PAYMENT HISTORY
        // --------------------------------------------------

        if (data && data.bookingId) {

          const paymentResponse = await fetch(
            API_BASE_URL +
            "/PgPeekIn/payments/booking/" +
            data.bookingId,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
              }
            }
          );

          if (paymentResponse.ok) {

            const paymentData =
              await paymentResponse.json();

            if (Array.isArray(paymentData)) {

              setPayments(paymentData);

            } else {

              setPayments([]);
            }

          } else {

            setPayments([]);
          }

        } else {

          setPayments([]);
        }

      } 
      catch (error) {
    console.error("Dashboard error:", error);
    setBooking(null);
    setPayments([]);
  }

      finally {

        setLoading(false);
      }
    };

    loadDashboard();

  }, [navigate]);


  // --------------------------------------------------
  // SEARCH PG
  // --------------------------------------------------

  const handleSearch = (e) => {

    e.preventDefault();

    const query = location.trim();

    if (query.length > 0) {

      const encodedLocation =
        encodeURIComponent(query);

      navigate(
        "/tenant/search-pg?location=" +
        encodedLocation
      );

      return;
    }

    navigate("/tenant/search-pg");
  };


  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  // --------------------------------------------------
  // STAY CALCULATION
  // --------------------------------------------------

  const stay = useMemo(() => {

    if (!booking) {

      return {
        totalDays: 0,
        elapsedDays: 0,
        remainingDays: 0,
        progress: 0
      };
    }

    if (!booking.checkIn || !booking.checkOut) {

      return {
        totalDays: 0,
        elapsedDays: 0,
        remainingDays: 0,
        progress: 0
      };
    }

    const start =
      new Date(booking.checkIn);

    const end =
      new Date(booking.checkOut);

    const today =
      new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const totalDays =
      Math.max(
        1,
        Math.ceil(
          (end - start) /
          millisecondsPerDay
        )
      );

    let elapsedDays =
      Math.ceil(
        (today - start) /
        millisecondsPerDay
      );

    if (elapsedDays < 0) {
      elapsedDays = 0;
    }

    if (elapsedDays > totalDays) {
      elapsedDays = totalDays;
    }

    let remainingDays =
      Math.ceil(
        (end - today) /
        millisecondsPerDay
      );

    if (remainingDays < 0) {
      remainingDays = 0;
    }

    let progress =
      (elapsedDays / totalDays) * 100;

    if (progress < 0) {
      progress = 0;
    }

    if (progress > 100) {
      progress = 100;
    }

    return {
      totalDays,
      elapsedDays,
      remainingDays,
      progress
    };

  }, [booking]);


  // --------------------------------------------------
  // PAYMENT CALCULATIONS
  // --------------------------------------------------

  const totalPaid = useMemo(() => {

    let total = 0;

    payments.forEach((payment) => {

      if (
        payment.status &&
        payment.status.toLowerCase() === "paid"
      ) {

        total =
          total +
          Number(payment.amount || 0);
      }

    });

    return total;

  }, [payments]);


  const paidPaymentCount = useMemo(() => {

    let count = 0;

    payments.forEach((payment) => {

      if (
        payment.status &&
        payment.status.toLowerCase() === "paid"
      ) {
        count++;
      }

    });

    return count;

  }, [payments]);


  // --------------------------------------------------
  // RENT HISTORY
  // --------------------------------------------------

  const rentHistory = useMemo(() => {

    if (!payments || payments.length === 0) {
      return [];
    }

    const paidPayments =
      payments.filter((payment) => {

        if (!payment.status) {
          return false;
        }

        return (
          payment.status.toLowerCase() === "paid"
        );
      });

    const lastPayments =
      paidPayments.slice(-6);

    return lastPayments.map((payment) => {

      let month = "-";

      if (payment.paymentDate) {

        const date =
          new Date(payment.paymentDate);

        if (!isNaN(date.getTime())) {

          month =
            date.toLocaleDateString(
              "en-IN",
              {
                month: "short"
              }
            );
        }
      }

      return {
        month: month,
        amount: Number(
          payment.amount || 0
        ),
        status: "paid"
      };

    });

  }, [payments]);


  // --------------------------------------------------
  // MAX RENT FOR CHART
  // --------------------------------------------------

  const maxRent = useMemo(() => {

    if (rentHistory.length === 0) {
      return 1;
    }

    let max = 0;

    rentHistory.forEach((item) => {

      if (item.amount > max) {
        max = item.amount;
      }

    });

    return max || 1;

  }, [rentHistory]);


  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="tenant-page">

        <aside className="tenant-sidebar">

          <div className="tenant-brand">
            <span>PGPeekIn</span>
          </div>

        </aside>

        <main className="tenant-main">

          <div
            style={{
              padding: "40px",
              textAlign: "center"
            }}
          >
            <h2>Loading dashboard...</h2>
          </div>

        </main>

      </div>
    );
  }


  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (

    <div className="tenant-page">


      <aside className="tenant-sidebar">

        <div className="tenant-brand">

          <div className="brand-logo">
            <img src={logo} alt="PgPeekIn Logo" />
          </div>

          <div className="brand-name">
            <strong>PGPeekIn</strong>
            <small>Tenant Portal</small>
          </div>

        </div>


        <nav className="tenant-menu">

          <Link
            to="/tenant-dashboard"
            className="active"
          >

            <span className="menu-icon">
              🏠
            </span>

            Dashboard

          </Link>


          <Link to="/tenant/search-pg">

            <span className="menu-icon">
              🔍
            </span>

            Search PG

          </Link>


          <Link to="/tenant/bookings">

            <span className="menu-icon">
              📋
            </span>

            My bookings

          </Link>


          <Link to="/tenant/reviews">

            <span className="menu-icon">
              ⭐
            </span>

            My reviews

          </Link>


          <Link to="/tenant/profile">

            <span className="menu-icon">
              👤
            </span>

            My profile

          </Link>

          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="logout-menu-item"
          >
            <span className="menu-icon">
              🚪
            </span>

            Logout
          </Link>

        </nav>

      </aside>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="tenant-main">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="tenant-header">

          <div>

            <h1>
              Tenant Dashboard
            </h1>

            <p>
              Welcome back, {userName}
            </p>

          </div>


          <div className="tenant-user">

            <div className="tenant-avatar">

              {userName
                ? userName.charAt(0).toUpperCase()
                : "T"}

            </div>

            <div>

              <strong>
                {userName}
              </strong>

              <span>
                Tenant
              </span>

            </div>

          </div>

        </header>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            style={{
              margin: "20px 0",
              padding: "15px",
              borderRadius: "10px",
              background: "#ffecec",
              color: "#b00020"
            }}
          >

            {error}

          </div>

        )}


        {/* ==================================================
            HERO SECTION
        ================================================== */}

        <section className="tenant-hero">


          {/* --------------------------------------------------
              HERO INFO
          -------------------------------------------------- */}

          <div className="tenant-hero-info">

  {booking ? (

    <>
      <div className="hero-status-pill">
        <span>●</span>
        {booking.bookingStatus || "Active"}
      </div>

      <h2>
        {booking.pgName || "My PG"}
      </h2>

      <div className="hero-location">
        📍 {booking.area || ""}
        {booking.area && booking.city ? ", " : ""}
        {booking.city || ""}
      </div>

      {/* TIMELINE */}
      <div className="hero-timeline">

        <div className="hero-timeline-track">

          <div
            className="hero-timeline-fill"
            style={{
              width: stay.progress + "%"
            }}
          />

          <div className="hero-timeline-marker">
            ✓
          </div>

        </div>

        <div className="hero-timeline-labels">

          <span>
            {formatDate(booking.checkIn)}
          </span>

          <span>
            {formatDate(booking.checkOut)}
          </span>

        </div>

      </div>

      <div className="hero-search">
  <form onSubmit={handleSearch}>
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="Search another PG..."
    />

    <button type="submit">
      Search
    </button>
  </form>
</div>
  </>

  ) : (

    <>
      <div className="hero-status-pill">
        <span>●</span>
        No booking
      </div>

      <h2>
        You don't have a booking yet
      </h2>

      <div className="hero-location">
        Find a PG that suits you.
      </div>

      {/* SEARCH */}
      <div className="hero-search">

        <form onSubmit={handleSearch}>

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Search PG by area or city..."
          />

          <button type="submit">
            Search
          </button>

        </form>

      </div>
    </>

  )}

</div>


          {/* --------------------------------------------------
              PROGRESS RING
          -------------------------------------------------- */}

          <div className="tenant-hero-ring">

            <div className="progress-ring">

              <svg
                width="180"
                height="180"
                viewBox="0 0 180 180"
              >

                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  opacity="0.15"
                />

                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="452"
                  strokeDashoffset={
                    452 -
                    (452 *
                      stay.progress) /
                    100
                  }
                  transform="rotate(-90 90 90)"
                />

              </svg>


              <div className="progress-ring-center">

                <strong>
                  {booking
                    ? stay.remainingDays
                    : 0}
                </strong>

                <span>
                  days left
                </span>

              </div>

            </div>


            <div className="ring-caption">

              {booking
                ? "Stay progress"
                : "No active stay"}

            </div>

          </div>

        </section>


        {/* ==================================================
            SUMMARY STATS
        ================================================== */}

        <section className="tenant-stats">


          <div className="stat-card">

  <div className="stat-icon">
    ₹
  </div>

  <div className="stat-content">

    <span>
      Total paid
    </span>

    <strong>
      ₹{totalPaid.toLocaleString("en-IN")}
    </strong>

  </div>

</div>


          <div className="stat-card">

  <div className="stat-icon">
    📋
  </div>

  <div className="stat-content">
    <span>
      Active booking
    </span>

    <strong>
      {booking ? "1" : "0"}
    </strong>
  </div>

</div>


<div className="stat-card">

  <div className="stat-icon">
    ⏰
  </div>

  <div className="stat-content">
    <span>
      Days remaining
    </span>

    <strong>
      {booking ? stay.remainingDays : "0"}
    </strong>
  </div>

</div>


<div className="stat-card">

  <div className="stat-icon">
    ⭐
  </div>

  <div className="stat-content">
    <span>
      Payments made
    </span>

    <strong>
      {paidPaymentCount}
    </strong>
  </div>

</div>

        </section>


        {/* ==================================================
            SPLIT SECTION
        ================================================== */}

        <section className="tenant-split">


          {/* --------------------------------------------------
              RENT CARD
          -------------------------------------------------- */}

          <div className="tenant-card rent-card">

            <div className="tenant-card-header">

              <div>

                <h3>
                  Payment History
                </h3>

                <p>
                  Your recent rent payments
                </p>

              </div>

            </div>


            {rentHistory.length === 0 ? (

              <div
                style={{
                  padding: "30px 10px",
                  textAlign: "center"
                }}
              >

                <p>
                  No payment history available.
                </p>

                {booking && (
                  <small>
                    Your payments will appear here.
                  </small>
                )}

              </div>

            ) : (

              <>

                <div className="bar-chart">

                  {rentHistory.map(
                    (item, index) => {

                      const height =
                        (item.amount /
                          maxRent) *
                        100;

                      return (

                        <div
                          className="bar-column"
                          key={index}
                        >

                          <div className="bar-value">

                            ₹
                            {item.amount.toLocaleString(
                              "en-IN"
                            )}

                          </div>

                          <div
                            className="bar"
                            style={{
                              height:
                                Math.max(
                                  height,
                                  10
                                ) + "%"
                            }}
                          />

                          <div className="bar-label">

                            {item.month}

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>


                <div className="bar-chart-legend">

                  <span>
                    <i className="dot dot-paid" />
                    Paid
                  </span>

                </div>

              </>

            )}

          </div>


          {/* --------------------------------------------------
              BOOKING CARD
          -------------------------------------------------- */}

          <div className="tenant-card booking-card">

            <div className="tenant-card-header">

              <div>

                <h3>
                  Current Booking
                </h3>

                <p>
                  Your current accommodation
                </p>

              </div>


              {booking && (

                <span className="status-active">
                  {booking.bookingStatus || "Active"}
                </span>

              )}

            </div>


            {!booking ? (

              <div
                style={{
                  padding: "35px 10px",
                  textAlign: "center"
                }}
              >

                <div
                  style={{
                    fontSize: "45px",
                    marginBottom: "10px"
                  }}
                >
                  🏠
                </div>

                <h3>
                  No booking yet
                </h3>

                <p>
                  You don't have an active PG booking.
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/tenant/search-pg")
                  }
                  className="booking-view-btn"
                >
                  Search PG
                </button>

              </div>

            ) : (

              <>

                <div className="booking-property">

                  <div className="property-icon">
                    🏠
                  </div>

                  <div>

                    <h4>
                      {booking.pgName || "PG"}
                    </h4>

                    <p>

                      {booking.area || ""}

                      {booking.area &&
                      booking.city
                        ? ", "
                        : ""}

                      {booking.city || ""}

                    </p>

                  </div>

                </div>


                <div className="booking-facts">


                  <div>

                    <strong>
                      Room
                    </strong>

                    <strong>
                      {booking.roomNo || "-"}
                    </strong>

                  </div>


                  <div>

                    <strong>
                      Slot
                    </strong>

                    <strong>
                      {booking.slotNo || "-"}
                    </strong>

                  </div>


                  <div>

                    <strong>
                      Check-in
                    </strong>

                    <strong>
                      {formatDate(
                        booking.checkIn
                      )}
                    </strong>

                  </div>


                  <div>

                    <strong>
                      Check-out
                    </strong>

                    <strong>
                      {formatDate(
                        booking.checkOut
                      )}
                    </strong>

                  </div>


                  <div>

                    <strong>
                      Monthly rent
                    </strong>

                    <strong>
                      ₹
                      {Number(
                        booking.monthlyRent || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  <div>

                    <strong>
                      Days left
                    </strong>

                    <strong>
                      {stay.remainingDays}
                    </strong>

                  </div>

                </div>


                <button
                  type="button"
                  className="booking-view-btn"
                  onClick={() =>
                    navigate("/tenant/bookings")
                  }
                >
                  View booking
                </button>

              </>

            )}

          </div>

        </section>


        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <section className="tenant-section">

  <div className="tenant-section-header">

    <div>
      <h2>
        Quick actions
      </h2>

      <p>
        Manage your PG stay
      </p>
    </div>

  </div>


  <div className="tenant-actions">


    <Link
      to="/tenant/search-pg"
      className="tenant-action-card"
    >

      <div className="action-icon">
        🔍
      </div>

      <div className="action-content">

        <strong>
          Search PG
        </strong>

        <span>
          Find your next PG
        </span>

      </div>

      <span className="action-chevron">
        →
      </span>

    </Link>


    <Link
      to="/tenant/bookings"
      className="tenant-action-card"
    >

      <div className="action-icon">
        📋
      </div>

      <div className="action-content">

        <strong>
          My bookings
        </strong>

        <span>
          View your bookings
        </span>

      </div>

      <span className="action-chevron">
        →
      </span>

    </Link>


    <Link
      to="/tenant/reviews"
      className="tenant-action-card"
    >

      <div className="action-icon">
        ⭐
      </div>

      <div className="action-content">

        <strong>
          My reviews
        </strong>

        <span>
          Manage your reviews
        </span>

      </div>

      <span className="action-chevron">
        →
      </span>

    </Link>


    <Link
      to="/tenant/profile"
      className="tenant-action-card"
    >

      <div className="action-icon">
        👤
      </div>

      <div className="action-content">

        <strong>
          My profile
        </strong>

        <span>
          Update your profile
        </span>

      </div>

      <span className="action-chevron">
        →
      </span>

    </Link>


  </div>

</section>
      </main>

    </div>

  );
}

export default TenantDashboard;