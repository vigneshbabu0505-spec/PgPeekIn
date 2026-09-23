   
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/pgpeekin-logo.png";
import "../../styles/Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH LOGGED-IN USER PROFILE
  // =========================================

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        

        const profileResponse = await fetch(
  `${API_BASE_URL}/PgPeekIn/users/profile`,
  {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  }
);

        
        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return;
          }

          if (profileResponse.status === 403) {
            throw new Error(
              "You are not authorized to view this profile."
            );
          }

          throw new Error("Failed to load profile.");
        }

        const profileData = await profileResponse.json();

        console.log("Owner Profile Data:", profileData);

        setProfile(profileData);

        // =========================================
        // GET OWNER DASHBOARD DATA
        // =========================================

        const dashboardResponse = await fetch(
          `${API_BASE_URL}/PgPeekIn/owner/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();

          console.log(
            "Owner Dashboard Data:",
            dashboardData
          );

          setDashboard(dashboardData);
        }
      } catch (err) {
        console.error("Profile Error:", err);

        setError(
          err.message || "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="profile-page">

        <main className="profile-main">

          <div className="profile-card">

            <h2>Loading profile...</h2>

            <p>
              Please wait while your profile
              information is loading.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="profile-page">

        <main className="profile-main">

          <div className="profile-card">

            <h2>Unable to load profile</h2>

            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="edit-profile-btn"
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // GET USER DETAILS
  // =========================================

  const userName =
    profile?.userName ??
    profile?.user_name ??
    profile?.name ??
    "Owner";

  const email =
    profile?.email ??
    profile?.userEmail ??
    profile?.user_email ??
    "-";

  const phone =
    profile?.phone ??
    profile?.userPhone ??
    profile?.user_phone ??
    "-";

  const gender =
    profile?.gender ??
    "-";

  const occupation =
    profile?.occupation ??
    "-";

  const role =
    profile?.role ??
    "OWNER";

  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  const totalPgs =
    dashboard?.totalPgs ?? 0;

  const totalRooms =
    dashboard?.totalRooms ?? 0;

  const totalTenants =
    dashboard?.totalTenants ??
    dashboard?.occupiedSlots ??
    0;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="profile-page">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="profile-sidebar">

        {/* BRAND */}

        <div className="profile-brand">

          <div className="brand-logo">
            <img
              src={logo}
              alt="PgPeekIn Logo"
            />
          </div>

          <div className="brand-name">

            <strong>PGPeekIn</strong>

            <small>Owner Portal</small>

          </div>

        </div>


        {/* MENU */}

        <nav className="profile-menu">

          <Link to="/owner-dashboard">

            <span>🏠</span>

            Dashboard

          </Link>


          <Link to="/owner/my-pgs">

            <span>🏢</span>

            My PGs

          </Link>


          <Link to="/owner/add-pg">

            <span>➕</span>

            Add PG

          </Link>


          <Link to="/owner/rooms">

            <span>🛏️</span>

            Manage Rooms

          </Link>


          <Link to="/owner/bookings">

            <span>📅</span>

            Bookings

          </Link>


          <Link to="/owner/tenants">

            <span>👥</span>

            Tenants

          </Link>


          <Link
            to="/owner/profile"
            className="active"
          >

            <span>👤</span>

            Profile

          </Link>

        </nav>


        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="profile-logout"
        >
          🚪 Logout
        </button>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="profile-main">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="profile-header">

          <div>

            <h1>My Profile</h1>

            <p>
              View and manage your owner account information.
            </p>

          </div>

        </div>


        {/* =========================================
            PROFILE CARD
        ========================================= */}

        <section className="profile-card">

          {/* =========================================
              PROFILE TOP
          ========================================= */}

          <div className="profile-top">

            <div className="large-profile-avatar">

              {userName
                ? userName.charAt(0).toUpperCase()
                : "O"}

            </div>


            <div className="profile-name">

              <h2>
                {userName}
              </h2>

              <p>
                {role === "OWNER"
                  ? "PG Owner"
                  : role}
              </p>

              <span className="profile-active">
                ● Active Account
              </span>

            </div>

          </div>


          {/* =========================================
              PERSONAL INFORMATION
          ========================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic account details
                </p>

              </div>

              <button
                className="edit-profile-btn"
                onClick={() =>
                  alert(
                    "Edit Profile feature will be added soon."
                  )
                }
              >
                ✏️ Edit Profile
              </button>

            </div>


            <div className="profile-details">

              {/* FULL NAME */}

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <div className="profile-value">
                  {userName}
                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <div className="profile-value">
                  {email}
                </div>

              </div>


              {/* PHONE */}

              <div className="profile-field">

                <label>
                  Phone Number
                </label>

                <div className="profile-value">
                  {phone}
                </div>

              </div>


              {/* GENDER */}

              <div className="profile-field">

                <label>
                  Gender
                </label>

                <div className="profile-value">
                  {gender}
                </div>

              </div>


              {/* OCCUPATION */}

              <div className="profile-field">

                <label>
                  Occupation
                </label>

                <div className="profile-value">
                  {occupation}
                </div>

              </div>


              {/* ROLE */}

              <div className="profile-field">

                <label>
                  Account Role
                </label>

                <div className="profile-value">
                  {role === "OWNER"
                    ? "PG Owner"
                    : role}
                </div>

              </div>

            </div>

          </div>


          {/* =========================================
              PROPERTY INFORMATION
          ========================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div>

                <h3>
                  Property Information
                </h3>

                <p>
                  Overview of properties managed by you
                </p>

              </div>

            </div>


            <div className="property-info-grid">

              {/* PGs */}

              <div className="property-info-card">

                <span>
                  🏢
                </span>

                <div>

                  <p>
                    PGs Owned
                  </p>

                  <strong>
                    {totalPgs}
                  </strong>

                </div>

              </div>


              {/* ROOMS */}

              <div className="property-info-card">

                <span>
                  🛏️
                </span>

                <div>

                  <p>
                    Total Rooms
                  </p>

                  <strong>
                    {totalRooms}
                  </strong>

                </div>

              </div>


              {/* TENANTS */}

              <div className="property-info-card">

                <span>
                  👥
                </span>

                <div>

                  <p>
                    Total Tenants
                  </p>

                  <strong>
                    {totalTenants}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* =========================================
              SECURITY
          ========================================= */}

          <div className="profile-section security-section">

            <div>

              <h3>
                Security
              </h3>

              <p>
                Manage your account password and
                security settings.
              </p>

            </div>

            <button
              className="change-password-btn"
              onClick={() =>
                alert(
                  "Change Password feature will be added soon."
                )
              }
            >
              🔒 Change Password
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;
