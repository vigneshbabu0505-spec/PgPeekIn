import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

function RoomFilter() {

    const { id } = useParams();
    const navigate = useNavigate();

    // =========================================================
    // SELECTED PG
    // =========================================================

    const [pg, setPg] = useState(null);
    const [pgLoading, setPgLoading] = useState(true);
    const [pgError, setPgError] = useState("");


    // =========================================================
    // FILTER VALUES
    // =========================================================

    const [sharingType, setSharingType] = useState("");
    const [category, setCategory] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");


    // =========================================================
    // APPLIED FILTERS
    // =========================================================

    const [appliedFilters, setAppliedFilters] = useState({
        sharingType: "",
        category: "",
        checkInDate: "",
        checkOutDate: "",
    });


    // =========================================================
    // ROOMS
    // =========================================================

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(false);


    // =========================================================
    // FETCH SELECTED PG
    // =========================================================

    useEffect(() => {

        const fetchPG = async () => {

            try {

                setPgLoading(true);
                setPgError("");

                console.log("Fetching selected PG:", id);

                const data = await apiRequest(
                    `/api/tenant/pg/${id}`
                );

                console.log("Selected PG received:", data);

                setPg(data);

            } catch (error) {

                console.error("Error loading PG:", error);

                setPgError(
                    error.message || "Failed to load PG details"
                );

            } finally {

                setPgLoading(false);

            }

        };


        if (id) {
            fetchPG();
        }

    }, [id]);


    // =========================================================
    // APPLY FILTERS
    // =========================================================

    const handleApplyFilters = async (e) => {

        e.preventDefault();


        if (!checkInDate || !checkOutDate) {

            alert(
                "Please select check-in and check-out dates"
            );

            return;
        }


        if (
            new Date(checkOutDate) <=
            new Date(checkInDate)
        ) {

            alert(
                "Check-out date must be after check-in date"
            );

            return;
        }


        try {

            setLoading(true);


            let url =
                `/PgPeekIn/pgs/${id}/rooms/available` +
                `?checkinDate=${checkInDate}` +
                `&checkoutDate=${checkOutDate}`;


            if (sharingType) {

                url += `&sharingType=${sharingType}`;

            }


            if (category) {

                url +=
                    `&category=${encodeURIComponent(category)}`;

            }


            console.log("Calling API:", url);


            const data = await apiRequest(url);


            console.log("Available rooms:", data);


            setRooms(
                Array.isArray(data)
                    ? data
                    : []
            );


            setAppliedFilters({

                sharingType,
                category,
                checkInDate,
                checkOutDate,

            });

        } catch (error) {

            console.error(
                "Room availability error:",
                error
            );

            alert(
                error.message ||
                "Failed to fetch available rooms"
            );

            setRooms([]);

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setSharingType("");
        setCategory("");
        setCheckInDate("");
        setCheckOutDate("");

        setAppliedFilters({

            sharingType: "",
            category: "",
            checkInDate: "",
            checkOutDate: "",

        });

        setRooms([]);

    };


    // =========================================================
    // BACKEND ALREADY FILTERS ROOMS
    // =========================================================

    const filteredRooms = rooms;


    // =========================================================
    // SELECT ROOM
    // =========================================================

    const handleSelectRoom = (room) => {

        navigate(`/tenant/pg/${id}/booking`, {

            state: {

                pg,
                room,

                checkInDate,
                checkOutDate,

            },

        });

    };


    // =========================================================
    // PG LOADING
    // =========================================================

    if (pgLoading) {

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
    // PG ERROR
    // =========================================================

    if (pgError || !pg) {

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
                            {pgError || "PG not found"}
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
    // MAP REAL BACKEND PG DATA
    // =========================================================

    const pgId = pg.pgid;

    const pgName = pg.pgname;

    const pgArea = pg.area;

    const pgCity = pg.city;


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="tenant-page">


            {/* =================================================
                SIDEBAR
                ================================================= */}

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


            {/* =================================================
                MAIN
                ================================================= */}

            <main className="tenant-main">


                {/* =================================================
                    HEADER
                    ================================================= */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Choose your room
                        </h1>

                        <p>
                            Check room availability and find the right
                            stay for your dates.
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


                {/* =================================================
                    BREADCRUMB
                    ================================================= */}

                <div className="room-breadcrumb">

                    <Link to="/tenant/search-pg">
                        Search PG
                    </Link>

                    <span>
                        →
                    </span>

                    <Link to={`/tenant/pg/${id}`}>

                        {pgName}

                    </Link>

                    <span>
                        →
                    </span>

                    <strong>
                        Rooms
                    </strong>

                </div>


                {/* =================================================
                    SELECTED PG
                    ================================================= */}

                <section className="room-pg-header">

                    <div>

                        <p className="room-eyebrow">
                            SELECTED PROPERTY
                        </p>

                        <h2>
                            {pgName}
                        </h2>

                        <p>
                            ⌖ {pgArea}, {pgCity}
                        </p>

                    </div>


                    <Link
                        to={`/tenant/pg/${id}`}
                        className="change-pg-button"
                    >

                        View PG Details

                    </Link>

                </section>


                {/* =================================================
                    FILTER SECTION
                    ================================================= */}

                <section className="room-filter-card">

                    <div className="room-filter-heading">

                        <div>

                            <p className="room-eyebrow">
                                ROOM FILTER
                            </p>

                            <h2>
                                Find a room that fits you
                            </h2>

                        </div>


                        <span>

                            {loading
                                ? "Searching..."
                                : `${filteredRooms.length} rooms`}

                        </span>

                    </div>


                    <form
                        className="room-filter-form"
                        onSubmit={handleApplyFilters}
                    >


                        {/* SHARING TYPE */}

                        <div className="filter-field">

                            <label>
                                Sharing Type
                            </label>

                            <select
                                value={sharingType}
                                onChange={(e) =>
                                    setSharingType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All sharing types
                                </option>

                                <option value="1">
                                    1 Sharing
                                </option>

                                <option value="2">
                                    2 Sharing
                                </option>

                                <option value="3">
                                    3 Sharing
                                </option>

                                <option value="4">
                                    4 Sharing
                                </option>

                            </select>

                        </div>


                        {/* CATEGORY */}

                        <div className="filter-field">

                            <label>
                                Room Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    AC & Non-AC
                                </option>

                                <option value="AC">
                                    AC
                                </option>

                                <option value="Non-AC">
                                    Non-AC
                                </option>

                            </select>

                        </div>


                        {/* CHECK IN */}

                        <div className="filter-field">

                            <label>
                                Check-in
                            </label>

                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) =>
                                    setCheckInDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CHECK OUT */}

                        <div className="filter-field">

                            <label>
                                Check-out
                            </label>

                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) =>
                                    setCheckOutDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="filter-actions">

                            <button
                                type="button"
                                className="clear-filter-button"
                                onClick={clearFilters}
                            >

                                Clear

                            </button>


                            <button
                                type="submit"
                                className="apply-filter-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Checking..."
                                    : "Apply Filters"}

                            </button>

                        </div>

                    </form>

                </section>


                {/* =================================================
                    DATE MESSAGE
                    ================================================= */}

                {(checkInDate || checkOutDate) && (

                    <div className="date-selection-message">

                        <span>
                            ◷
                        </span>

                        <div>

                            <strong>
                                Stay dates selected
                            </strong>

                            <p>

                                {checkInDate ||
                                    "Select check-in"}

                                {" → "}

                                {checkOutDate ||
                                    "Select check-out"}

                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    ROOM RESULTS
                    ================================================= */}

                <section className="room-results">

                    <div className="room-results-heading">

                        <div>

                            <p className="room-eyebrow">
                                AVAILABLE ROOMS
                            </p>

                            <h2>
                                Rooms at {pgName}
                            </h2>

                        </div>


                        <span>

                            {filteredRooms.length}
                            {" "}
                            matching room
                            {filteredRooms.length !== 1
                                ? "s"
                                : ""}

                        </span>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="room-empty-state">

                            <div className="room-empty-icon">
                                ⌕
                            </div>

                            <h3>
                                Checking room availability...
                            </h3>

                            <p>
                                Please wait while we check the
                                selected dates.
                            </p>

                        </div>


                    ) : filteredRooms.length > 0 ? (


                        /* =================================================
                           ROOMS
                           ================================================= */

                        <div className="room-list">

                            {filteredRooms.map((room) => (

                                <article
                                    className="room-card"
                                    key={room.roomId}
                                >


                                    {/* ROOM VISUAL */}

                                    <div className="room-visual">

                                        <div className="room-number">

                                            <span>
                                                ROOM
                                            </span>

                                            <strong>
                                                {room.roomNo}
                                            </strong>

                                        </div>


                                        <div className="room-category-badge">

                                            {room.category}

                                        </div>

                                    </div>


                                    {/* ROOM CONTENT */}

                                    <div className="room-content">

                                        <div className="room-title-row">

                                            <div>

                                                <p>
                                                    Room {room.roomNo}
                                                </p>

                                                <h3>
                                                    {room.sharingType}
                                                    {" "}
                                                    Sharing
                                                </h3>

                                            </div>


                                            <div className="room-availability">

                                                <span className="availability-dot"></span>

                                                {room.availableSlots}
                                                {" "}
                                                slot
                                                {room.availableSlots !== 1
                                                    ? "s"
                                                    : ""}
                                                {" "}
                                                available

                                            </div>

                                        </div>


                                        {/* ROOM DETAILS */}

                                        <div className="room-detail-row">


                                            <div>

                                                <span>
                                                    Category
                                                </span>

                                                <strong>
                                                    {room.category}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Sharing
                                                </span>

                                                <strong>
                                                    {room.sharingType}
                                                    {" "}
                                                    Sharing
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Daily Rent
                                                </span>

                                                <strong>
                                                    ₹{room.dailyRent ?? "N/A"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Monthly Rent
                                                </span>

                                                <strong>
                                                    ₹{room.monthlyRent ?? "N/A"}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="room-card-footer">

                                            <div className="slot-info">

                                                <span>
                                                    Slot availability
                                                </span>

                                                <strong>
                                                    {room.availableSlots}
                                                    {" / "}
                                                    {room.totalSlots}
                                                </strong>

                                            </div>


                                            <button
                                                className="select-room-button"
                                                disabled={
                                                    room.availableSlots === 0
                                                }
                                                onClick={() =>
                                                    handleSelectRoom(room)
                                                }
                                            >

                                                {room.availableSlots === 0
                                                    ? "Fully Occupied"
                                                    : "Select Room →"}

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>


                    ) : (


                        /* =================================================
                           EMPTY
                           ================================================= */

                        <div className="room-empty-state">

                            <div className="room-empty-icon">
                                ⌕
                            </div>

                            <h3>
                                No rooms match your filters
                            </h3>

                            <p>
                                Select check-in and check-out dates
                                to check room availability.
                            </p>

                            <button
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}

                </section>


                {/* =================================================
                    IMPORTANT INFO
                    ================================================= */}

                <section className="availability-note">

                    <div className="note-icon">
                        i
                    </div>

                    <div>

                        <strong>
                            Availability is date-based
                        </strong>

                        <p>
                            A room can be available for one date range
                            and occupied for another. Final availability
                            will be checked from the Slot_Allocation
                            records when you continue with your booking.
                        </p>

                    </div>

                </section>


            </main>

        </div>

    );

}

export default RoomFilter;