import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/pgpeekin-logo.png";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../../styles/OwnerDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function OwnerDashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/PgPeekIn/owner/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        // =========================
        // RESPONSE CHECK
        // =========================

        if (!response.ok) {

          if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          }

          if (response.status === 403) {
            throw new Error(
              "You are not authorized to view this dashboard."
            );
          }

          throw new Error(
            "Failed to load dashboard."
          );
        }


        // =========================
        // GET JSON
        // =========================

        const data = await response.json();

        console.log(
          "Owner Dashboard Data:",
          data
        );

        setDashboard(data);

      } catch (err) {

        console.error(
          "Dashboard Error:",
          err
        );

        setError(
          err.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="owner-dashboard">

        <main className="owner-main">

          <div className="analytics-card">

            <h2>
              Loading dashboard...
            </h2>

            <p>
              Please wait while your dashboard
              data is loading.
            </p>

          </div>

        </main>

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="owner-dashboard">

        <main className="owner-main">

          <div className="analytics-card">

            <h2>
              Unable to load dashboard
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="view-all-btn"
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );

  }


  // =========================
  // SAFETY
  // =========================

  if (!dashboard) {

    return (
      <div className="owner-dashboard">

        <main className="owner-main">

          <div className="analytics-card">

            <h2>
              No dashboard data available
            </h2>

          </div>

        </main>

      </div>
    );

  }


  // =========================
  // STATISTICS
  // =========================

  const stats = [

    {
      title: "Total PGs",
      value: dashboard.totalPgs ?? 0,
      icon: "🏢",
      link: "/owner/my-pgs",
    },

    {
      title: "Total Rooms",
      value: dashboard.totalRooms ?? 0,
      icon: "🛏️",
      link: "/owner/rooms",
    },

    {
      title: "Available Slots",
      value: dashboard.availableSlots ?? 0,
      icon: "🟢",
      link: "/owner/rooms",
    },

    {
      title: "Occupied Slots",
      value: dashboard.occupiedSlots ?? 0,
      icon: "👥",
      link: "/owner/rooms",
    },

  ];

const getUserName = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return "Owner";
  }

  try {
    const parsedUser = JSON.parse(storedUser);

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

    if (parsedUser.email) {
      return parsedUser.email.split("@")[0];
    }

    return "Owner";

  } catch (error) {
    console.error("User data parsing error:", error);
    return "Owner";
  }
};

const userName = getUserName();
  // =========================
  // BOOKING TRENDS
  // =========================

  const bookingData =
    Array.isArray(dashboard.bookingTrends)
      ? dashboard.bookingTrends
      : [];


  // =========================
  // OCCUPANCY
  // =========================

  const occupancyData = [

    {
      name: "Occupied",
      value: Number(
        dashboard.occupiedSlots ?? 0
      ),
    },

    {
      name: "Available",
      value: Number(
        dashboard.availableSlots ?? 0
      ),
    },

  ];


  // =========================
  // RECENT BOOKINGS
  // =========================

  const bookings =
    Array.isArray(dashboard.recentBookings)
      ? dashboard.recentBookings
      : [];


  // =========================
  // UI
  // =========================

  return (

    <div className="owner-dashboard">


      {/* ================= SIDEBAR ================= */}

      <aside className="owner-sidebar">

        <div className="owner-brand">

  <div className="brand-logo">
    <img src={logo} alt="PgPeekIn Logo" />
  </div>

  <div className="brand-name">
    <strong>PGPeekIn</strong>
    <small>Owner Portal</small>
  </div>

</div>


        <nav className="owner-menu">

          <Link
            to="/owner-dashboard"
            className="owner-menu-item active"
          >
            <span>🏠</span>
            Dashboard
          </Link>


          <Link
            to="/owner/my-pgs"
            className="owner-menu-item"
          >
            <span>🏢</span>
            My PGs
          </Link>


          <Link
            to="/owner/add-pg"
            className="owner-menu-item"
          >
            <span>➕</span>
            Add PG
          </Link>


          <Link
            to="/owner/rooms"
            className="owner-menu-item"
          >
            <span>🛏️</span>
            Manage Rooms
          </Link>


          <Link
            to="/owner/bookings"
            className="owner-menu-item"
          >
            <span>📅</span>
            Bookings
          </Link>


          <Link
            to="/owner/tenants"
            className="owner-menu-item"
          >
            <span>👥</span>
            Tenants
          </Link>


          <Link
            to="/owner/profile"
            className="owner-menu-item"
          >
            <span>👤</span>
            Profile
          </Link>

          <button
          onClick={handleLogout}
          className="owner-logout"
        >
        🚪Logout
        </button>

        </nav>
      </aside>



      {/* ================= MAIN ================= */}

      <main className="owner-main">


        {/* ================= TOP BAR ================= */}

        <div className="owner-topbar">

          <div>

           <h1>
  Welcome back, {userName} 👋
  </h1>

            <p>
              Here's what's happening with your
              PGs today.
            </p>

          </div>


          <div className="owner-profile">

  <div className="owner-avatar">
    {userName
      ? userName.charAt(0).toUpperCase()
      : "O"}
  </div>

  <div>

    <strong>
      {userName}
    </strong>

    <p>
      Owner Account
    </p>

  </div>

</div>

        </div>



        {/* ================= STAT CARDS ================= */}

        <section className="owner-stats">

          {stats.map((stat, index) => (

            <Link
              to={stat.link}
              className="owner-stat-link"
              key={index}
            >

              <div className="owner-stat-card">

                <div className="owner-stat-icon">
                  {stat.icon}
                </div>

                <div>

                  <p>
                    {stat.title}
                  </p>

                  <h2>
                    {stat.value}
                  </h2>

                </div>

              </div>

            </Link>

          ))}

        </section>



        {/* ================= ANALYTICS ================= */}

        <section className="analytics-grid">


          {/* ================= BOOKING TREND ================= */}

          <div className="analytics-card">

            <div className="analytics-header">

              <div>

                <h2>
                  Booking Trends
                </h2>

                <p>
                  Monthly booking activity
                </p>

              </div>

              <span className="analytics-badge">
                Last 6 Months
              </span>

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <LineChart
                  data={bookingData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#1c3b63"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>



          {/* ================= OCCUPANCY ================= */}

          <div className="analytics-card occupancy-card">

            <div className="analytics-header">

              <div>

                <h2>
                  Slot Occupancy
                </h2>

                <p>
                  Current room availability
                </p>

              </div>

            </div>


            <div className="pie-container">

              <ResponsiveContainer
                width="100%"
                height={250}
              >

                <PieChart>

                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >

                    <Cell
                      fill="#1c3b63"
                    />

                    <Cell
                      fill="#22c55e"
                    />

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>



        {/* ================= QUICK ACTIONS ================= */}

        <section className="owner-section">

          <div className="section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your PG properties quickly.
              </p>

            </div>

          </div>


          <div className="owner-actions">

            <Link
              to="/owner/add-pg"
              className="owner-action-card"
            >

              <span>➕</span>

              <h3>
                Add New PG
              </h3>

              <p>
                Create and list a new PG property.
              </p>

            </Link>


            <Link
              to="/owner/rooms"
              className="owner-action-card"
            >

              <span>🛏️</span>

              <h3>
                Manage Rooms
              </h3>

              <p>
                Add rooms and update availability.
              </p>

            </Link>


            <Link
              to="/owner/bookings"
              className="owner-action-card"
            >

              <span>📅</span>

              <h3>
                View Bookings
              </h3>

              <p>
                Check tenant booking requests.
              </p>

            </Link>

          </div>

        </section>



        


      </main>

    </div>
  );
}

export default OwnerDashboard;