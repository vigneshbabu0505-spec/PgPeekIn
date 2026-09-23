import { Link, useParams } from "react-router-dom";
import "../../styles/BookingDetails.css";

function BookingDetails() {
  const { id } = useParams();

  // Temporary dummy data
  // Later this will come from the backend using the booking ID.
  const booking = {
    id: id || "BK001",

    tenant: {
      name: "Rahul Kumar",
      phone: "+91 98765 43210",
      email: "rahul@gmail.com",
      tenantId: "TEN001",
    },

    pg: {
      name: "Sunshine PG",
      location: "Chennai",
      room: "Room 203",
      sharing: "2 Sharing",
      type: "AC",
      bed: "Bed 1",
      rent: "₹9,000 / month",
    },

    booking: {
      bookingDate: "01 Sep 2026",
      checkIn: "05 Sep 2026",
      checkOut: "05 Dec 2026",
      status: "Confirmed",
    },

    payment: {
      amount: "₹9,000",
      status: "Paid",
      date: "02 Sep 2026",
      method: "UPI",
      transactionId: "TXN458921",
    },
  };

  return (
    <div className="booking-details-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="booking-details-sidebar">

        <div className="booking-details-brand">
          <h2>PGPeekIn</h2>
          <p>Owner Panel</p>
        </div>

        <nav className="booking-details-menu">

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

          <Link
            to="/owner/bookings"
            className="active"
          >
            <span>📅</span>
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

        <Link
          to="/login"
          className="booking-details-logout"
        >
          🚪 Logout
        </Link>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="booking-details-main">

        {/* HEADER */}

        <div className="booking-details-header">

          <div>

            <Link
              to="/owner/bookings"
              className="back-to-bookings"
            >
              ← Back to Bookings
            </Link>

            <h1>Booking Details</h1>

            <p>
              Complete information about booking {booking.id}
            </p>

          </div>

          <span className="details-status confirmed">
            {booking.booking.status}
          </span>

        </div>


        {/* ================= TOP INFO ================= */}

        <section className="booking-info-grid">

          {/* TENANT */}

          <div className="details-card">

            <div className="details-card-title">
              <span>👤</span>
              <h2>Tenant Information</h2>
            </div>

            <div className="tenant-profile">

              <div className="tenant-avatar">
                {booking.tenant.name.charAt(0)}
              </div>

              <div>
                <h3>{booking.tenant.name}</h3>
                <p>Tenant ID: {booking.tenant.tenantId}</p>
              </div>

            </div>

            <div className="details-list">

              <div>
                <span>📞 Phone</span>
                <strong>{booking.tenant.phone}</strong>
              </div>

              <div>
                <span>✉️ Email</span>
                <strong>{booking.tenant.email}</strong>
              </div>

            </div>

          </div>


          {/* PG & ROOM */}

          <div className="details-card">

            <div className="details-card-title">
              <span>🏠</span>
              <h2>PG & Room Information</h2>
            </div>

            <div className="details-list">

              <div>
                <span>PG Name</span>
                <strong>{booking.pg.name}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{booking.pg.location}</strong>
              </div>

              <div>
                <span>Room</span>
                <strong>{booking.pg.room}</strong>
              </div>

              <div>
                <span>Sharing Type</span>
                <strong>{booking.pg.sharing}</strong>
              </div>

              <div>
                <span>Room Type</span>
                <strong>{booking.pg.type}</strong>
              </div>

              <div>
                <span>Bed / Slot</span>
                <strong>{booking.pg.bed}</strong>
              </div>

              <div>
                <span>Monthly Rent</span>
                <strong>{booking.pg.rent}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* ================= BOOKING + PAYMENT ================= */}

        <section className="booking-info-grid">

          {/* BOOKING INFORMATION */}

          <div className="details-card">

            <div className="details-card-title">
              <span>📅</span>
              <h2>Booking Information</h2>
            </div>

            <div className="details-list">

              <div>
                <span>Booking ID</span>
                <strong>{booking.id}</strong>
              </div>

              <div>
                <span>Booking Date</span>
                <strong>{booking.booking.bookingDate}</strong>
              </div>

              <div>
                <span>Check-in Date</span>
                <strong>{booking.booking.checkIn}</strong>
              </div>

              <div>
                <span>Check-out Date</span>
                <strong>{booking.booking.checkOut}</strong>
              </div>

              <div>
                <span>Status</span>

                <span className="details-status confirmed">
                  {booking.booking.status}
                </span>

              </div>

            </div>

          </div>


          {/* PAYMENT */}

          <div className="details-card">

            <div className="details-card-title">
              <span>💰</span>
              <h2>Payment Information</h2>
            </div>

            <div className="details-list">

              <div>
                <span>Amount</span>
                <strong>{booking.payment.amount}</strong>
              </div>

              <div>
                <span>Payment Status</span>

                <span className="payment-status paid">
                  {booking.payment.status}
                </span>

              </div>

              <div>
                <span>Payment Date</span>
                <strong>{booking.payment.date}</strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{booking.payment.method}</strong>
              </div>

              <div>
                <span>Transaction ID</span>
                <strong>{booking.payment.transactionId}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* ================= BOOKING HISTORY ================= */}

        <section className="details-card history-card">

          <div className="details-card-title">
            <span>🕐</span>
            <h2>Booking History</h2>
          </div>

          <div className="timeline">

            <div className="timeline-item">

              <div className="timeline-dot"></div>

              <div>
                <h3>Booking Confirmed</h3>
                <p>
                  Owner confirmed the booking request.
                </p>
                <span>02 Sep 2026, 10:30 AM</span>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-dot"></div>

              <div>
                <h3>Payment Received</h3>
                <p>
                  Payment of ₹9,000 was successfully received.
                </p>
                <span>02 Sep 2026, 10:15 AM</span>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-dot"></div>

              <div>
                <h3>Booking Created</h3>
                <p>
                  Tenant submitted a booking request.
                </p>
                <span>01 Sep 2026, 04:20 PM</span>
              </div>

            </div>

          </div>

        </section>


        {/* ================= ACTIONS ================= */}

        <section className="booking-details-actions">

          <button className="cancel-booking-btn">
            Cancel Booking
          </button>

          <button className="contact-tenant-btn">
            Contact Tenant
          </button>

        </section>

      </main>

    </div>
  );
}

export default BookingDetails;