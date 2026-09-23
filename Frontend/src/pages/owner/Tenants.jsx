import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/Tenants.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function Tenants() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH ACTUAL TENANTS FROM LOGGED-IN OWNER'S PG
  // ==================================================
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/owner/tenants`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");

        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw new Error(
            typeof data === "string"
              ? data
              : data?.message || "Failed to fetch tenants"
          );
        }

        setTenants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("TENANTS ERROR =", err);
        setError(err.message || "Failed to load tenants");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // ==================================================
  // SUMMARY
  // ==================================================
  const totalTenants = tenants.length;

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "Active"
  ).length;

  const upcomingTenants = tenants.filter(
    (tenant) => tenant.status === "Upcoming"
  ).length;

  const completedTenants = tenants.filter(
    (tenant) => tenant.status === "Completed"
  ).length;

  // ==================================================
  // SEARCH + FILTER
  // ==================================================
  const filteredTenants = tenants.filter((tenant) => {
    const matchesFilter =
      filter === "All" || tenant.status === filter;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      tenant.name?.toLowerCase().includes(searchText) ||
      String(tenant.bookingId || "")
        .toLowerCase()
        .includes(searchText) ||
      tenant.pg?.toLowerCase().includes(searchText) ||
      tenant.room?.toLowerCase().includes(searchText) ||
      tenant.phone?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // ==================================================
  // LOADING
  // ==================================================
  if (loading) {
    return (
      <div className="tenants-page">
        <aside className="tenants-sidebar">
          <div className="tenants-brand">
            <h2>PGPeekIn</h2>
            <p>Owner Panel</p>
          </div>

          <nav className="tenants-menu">
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

            <Link
              to="/owner/tenants"
              className="active"
            >
              <span>👥</span>
              Tenants
            </Link>

            <Link to="/owner/profile">
              <span>👤</span>
              Profile
            </Link>
          </nav>

          <Link to="/login" className="tenants-logout">
            🚪 Logout
          </Link>
        </aside>

        <main className="tenants-main">
          <div className="tenants-header">
            <div>
              <h1>Tenants</h1>
              <p>
                View and manage tenants staying in your PG.
              </p>
            </div>
          </div>

          <section className="tenants-section">
            <div className="no-tenants">
              <div>⏳</div>
              <h3>Loading tenants...</h3>
              <p>Fetching actual bookings from your PG.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================
  if (error) {
    return (
      <div className="tenants-page">
        <aside className="tenants-sidebar">
          <div className="tenants-brand">
            <h2>PGPeekIn</h2>
            <p>Owner Panel</p>
          </div>

          <nav className="tenants-menu">
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

            <Link
              to="/owner/tenants"
              className="active"
            >
              <span>👥</span>
              Tenants
            </Link>

            <Link to="/owner/profile">
              <span>👤</span>
              Profile
            </Link>
          </nav>

          <Link to="/login" className="tenants-logout">
            🚪 Logout
          </Link>
        </aside>

        <main className="tenants-main">
          <div className="tenants-header">
            <div>
              <h1>Tenants</h1>
              <p>
                View and manage tenants staying in your PG.
              </p>
            </div>
          </div>

          <section className="tenants-section">
            <div className="no-tenants">
              <div>⚠️</div>
              <h3>Failed to load tenants</h3>
              <p>{error}</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="tenants-page">

      {/* SIDEBAR */}
      <aside className="tenants-sidebar">

        <div className="tenants-brand">
          <h2>PGPeekIn</h2>
          <p>Owner Panel</p>
        </div>

        <nav className="tenants-menu">

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

          <Link
            to="/owner/tenants"
            className="active"
          >
            <span>👥</span>
            Tenants
          </Link>

          <Link to="/owner/profile">
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <Link to="/login" className="tenants-logout">
          🚪 Logout
        </Link>

      </aside>

      {/* MAIN CONTENT */}
      <main className="tenants-main">

        {/* HEADER */}
        <div className="tenants-header">

          <div>
            <h1>Tenants</h1>
            <p>
              View and manage tenants who booked rooms in your PG.
            </p>
          </div>

          <div className="tenants-owner">
            <div className="tenants-avatar">
              O
            </div>

            <div>
              <strong>PG Owner</strong>
              <p>Owner Account</p>
            </div>
          </div>

        </div>

        {/* SUMMARY CARDS */}
        <section className="tenant-summary">

          <div className="tenant-summary-card">
            <div className="tenant-summary-icon total-icon">
              👥
            </div>

            <div>
              <p>Total Tenants</p>
              <h2>{totalTenants}</h2>
            </div>
          </div>

          <div className="tenant-summary-card">
            <div className="tenant-summary-icon active-icon">
              🟢
            </div>

            <div>
              <p>Active Tenants</p>
              <h2>{activeTenants}</h2>
            </div>
          </div>

          <div className="tenant-summary-card">
            <div className="tenant-summary-icon upcoming-icon">
              📅
            </div>

            <div>
              <p>Upcoming</p>
              <h2>{upcomingTenants}</h2>
            </div>
          </div>

          <div className="tenant-summary-card">
            <div className="tenant-summary-icon completed-icon">
              ✅
            </div>

            <div>
              <p>Completed</p>
              <h2>{completedTenants}</h2>
            </div>
          </div>

        </section>

        {/* TENANTS SECTION */}
        <section className="tenants-section">

          <div className="tenants-section-header">

            <div>
              <h2>All Tenants</h2>
              <p>
                Tenants who have booked rooms in your PG.
              </p>
            </div>

            <span className="tenant-count">
              {filteredTenants.length} tenants
            </span>

          </div>

          {/* SEARCH + FILTER */}
          <div className="tenant-controls">

            <div className="tenant-search">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search tenant, PG, room or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

          </div>

          {/* TABLE */}
          <div className="tenants-table-container">

            <table className="tenants-table">

              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Booking</th>
                  <th>PG / Room</th>
                  <th>Stay Period</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredTenants.map((tenant) => (

                  <tr key={tenant.bookingId}>

                    {/* TENANT */}
                    <td>
                      <div className="tenant-profile">

                        <div className="tenant-table-avatar">
                          {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>

                        <div>
                          <strong>
                            {tenant.name}
                          </strong>

                          <small>
                            User ID: {tenant.id}
                          </small>
                        </div>

                      </div>
                    </td>

                    {/* BOOKING */}
                    <td>
                      <div className="tenant-booking">

                        <strong>
                          #{tenant.bookingId}
                        </strong>

                        <small>
                          Reservation
                        </small>

                      </div>
                    </td>

                    {/* PG / ROOM */}
                    <td>
                      <div className="tenant-pg-room">

                        <strong>
                          {tenant.pg}
                        </strong>

                        <span>
                          {tenant.room}
                          {tenant.slotNo !== null &&
                            tenant.slotNo !== undefined
                            ? ` • Slot ${tenant.slotNo}`
                            : ""}
                        </span>

                      </div>
                    </td>

                    {/* STAY PERIOD */}
                    <td>
                      <div className="tenant-stay">

                        <span>
                          {tenant.checkIn}
                        </span>

                        <span className="tenant-arrow">
                          →
                        </span>

                        <span>
                          {tenant.checkOut}
                        </span>

                      </div>
                    </td>

                    {/* CONTACT */}
                    <td>
                      <span className="tenant-phone">
                        📞 {tenant.phone || "Not provided"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`tenant-status ${tenant.status.toLowerCase()}`}
                      >
                        <span className="tenant-status-dot"></span>
                        {tenant.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td>
                      <Link
                        to={`/owner/bookings/${tenant.bookingId}`}
                        className="view-tenant-btn"
                      >
                        View
                      </Link>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* EMPTY STATE */}
            {filteredTenants.length === 0 && (
              <div className="no-tenants">
                <div>🔍</div>

                <h3>
                  No tenants found
                </h3>

                <p>
                  No bookings match your search or status filter.
                </p>
              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Tenants;
