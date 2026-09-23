import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MyPGs.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MyPGs = () => {
  const [pg, setPg] = useState(null);
  const [pgPhoto, setPgPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPg = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        // =========================
        // FETCH MY PG
        // =========================
        const response = await fetch(
          `${API_BASE_URL}/pgowner/my-pg`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data === "string" ? data : "Failed to fetch PG"
          );
        }

        setPg(data);

        // =========================
        // FETCH PG PHOTOS
        // =========================
        const photoResponse = await fetch(
          `${API_BASE_URL}/pgowner/photos/${data.pgid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (photoResponse.ok) {
          const photos = await photoResponse.json();
          console.log("PG PHOTOS =", photos);
          if (photos && photos.length > 0) {
            const sortedPhotos = [...photos].sort(
              (a, b) =>
                Number(a.photoid || 0) -
              Number(b.photoid || 0)
            );
            setPgPhoto(
              sortedPhotos[0].photoPath
            );
          }
        }
      } catch (err) {
        console.error("MY PG ERROR:", err);
        setError(err.message || "Failed to load PG");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPg();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="owner-layout">
        <main className="owner-main">
          <h1>My PGs</h1>
          <p>Loading your PG...</p>
        </main>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="owner-layout">
        <main className="owner-main">
          <h1>My PGs</h1>
          <p style={{ color: "red" }}>{error}</p>
        </main>
      </div>
    );
  }

  // =========================
  // NO PG
  // =========================
  if (!pg) {
    return (
      <div className="owner-layout">
        <main className="owner-main">
          <div className="page-header">
            <div>
              <h1>My PGs</h1>
              <p>Manage all your PG properties</p>
            </div>

            <Link to="/owner/add-pg" className="add-pg-btn">
              + Add New PG
            </Link>
          </div>

          <p>You have not added a PG yet.</p>
        </main>
      </div>
    );
  }

  // =========================
  // ROOM / SLOT STATS
  // =========================
  const rooms = 0;
  const slots = 0;
  const availableSlots = 0;
  const occupiedSlots = 0;

  const occupancyPercentage =
    slots > 0 ? Math.round((occupiedSlots / slots) * 100) : 0;

  return (
    <div className="owner-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="owner-sidebar">

        <div className="sidebar-logo">
          <div className="logo-box">P</div>
          <span>PGPeekIn</span>
        </div>

        <nav className="sidebar-nav">

          <Link to="/owner-dashboard">
            <span>📊</span>
            Dashboard
          </Link>

          <Link to="/owner/my-pgs" className="active">
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
            <span>📋</span>
            Bookings
          </Link>

          <Link to="/owner/tenants">
            <span>👥</span>
            Tenants
          </Link>

          <Link to="/owner/profile">
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link to="/">
            <span>🚪</span>
            Logout
          </Link>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="owner-main">

        {/* HEADER */}

        <div className="page-header">

          <div>
            <h1>My PGs</h1>
            <p>Manage all your PG properties</p>
          </div>

          <Link to="/owner/add-pg" className="add-pg-btn">
            + Add New PG
          </Link>

        </div>

        {/* ================= PG CARD ================= */}

        <div className="pg-grid">

          <div className="pg-card">

            {/* ================= IMAGE ================= */}

            <div className="pg-image">

              {pgPhoto ? (
                <img
                  src={pgPhoto}
                  alt={`${pg.pgname} PG`}
                  className="pg-photo"
                  onError={(e) => {
                    console.error("IMAGE LOAD ERROR:", pgPhoto);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>🏢</span>
              )}

              <div className="property-badge">
                Active Property
              </div>

            </div>

            {/* ================= CONTENT ================= */}

            <div className="pg-content">

              {/* TITLE */}

              <div className="pg-title-row">

                <div>

                  <h2>{pg.pgname}</h2>

                  <p className="pg-location">
                    📍 {pg.area}, {pg.city}
                  </p>

                </div>

                <span className="pg-status">
                  Active
                </span>

              </div>

              {/* PG DETAILS */}

              <div className="pg-details">

                <p>
                  <strong>Type:</strong>{" "}
                  {pg.pgtype}
                </p>

                <p>
                  <strong>Branch:</strong>{" "}
                  {pg.pgbranch}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {pg.pgphnno}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {pg.street}, {pg.area}, {pg.city} -{" "}
                  {pg.pincode}
                </p>

              </div>

              {/* STATS */}

              <div className="pg-stats">

                <div>
                  <strong>{rooms}</strong>
                  <span>Rooms</span>
                </div>

                <div>
                  <strong>{slots}</strong>
                  <span>Total Slots</span>
                </div>

                <div>
                  <strong>{availableSlots}</strong>
                  <span>Available</span>
                </div>

              </div>

              {/* OCCUPANCY */}

              <div className="occupancy-section">

                <div className="occupancy-header">

                  <span>Slot Occupancy</span>

                  <strong>
                    {occupancyPercentage}%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${occupancyPercentage}%`,
                    }}
                  />

                </div>

                <div className="occupancy-info">

                  <span>
                    {occupiedSlots} occupied
                  </span>

                  <span>
                    {availableSlots} available
                  </span>

                </div>

              </div>

              {/* FACILITIES */}

              <div className="facilities">

                <span>
                  PG Type: {pg.pgtype}
                </span>

                <span>
                  Branch: {pg.pgbranch}
                </span>

              </div>

              {/* BUTTONS */}

              <div className="pg-actions">

                <Link
                  to={`/owner/edit-pg/${pg.pgid}`}
                  className="view-btn"
                >
                  View / Edit Details
                </Link>

                <Link
                  to="/owner/rooms"
                  className="manage-btn"
                >
                  Manage Rooms
                </Link>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default MyPGs;