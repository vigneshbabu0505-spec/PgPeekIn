import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/ManageRooms.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function ManageRooms() {
  // ================= STATE =================

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= ADD ROOM STATE =================

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);

  const [roomForm, setRoomForm] = useState({
    roomNo: "",
    category: "Non-AC",
    sharingType: "2",
    monthlyRent: "",
    dailyRent: "",
  });

  // ================= EDIT ROOM STATE =================

  const [showEditRoom, setShowEditRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editRoomForm, setEditRoomForm] = useState({
    roomNo: "",
    category: "Non-AC",
    sharingType: "1",
    monthlyRent: "",
    dailyRent: "",
  });

  // ==================================================
  // FETCH PG + ROOMS
  // ==================================================

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        // ==================================================
        // 1. GET OWNER'S PG
        // ==================================================

        const pgResponse = await fetch(
          `${API_BASE_URL}/pgowner/my-pg`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pgContentType =
          pgResponse.headers.get("content-type");

        const pgData =
          pgContentType?.includes("application/json")
            ? await pgResponse.json()
            : await pgResponse.text();

        if (!pgResponse.ok) {
          throw new Error(
            typeof pgData === "string"
              ? pgData
              : "Failed to fetch PG"
          );
        }

        if (!pgData) {
          throw new Error(
            "You have not added a PG yet"
          );
        }

        console.log("MY PG =", pgData);

        setPg(pgData);

        // ==================================================
        // 2. GET ROOMS FOR THAT PG
        // ==================================================

        const roomResponse = await fetch(
          `${API_BASE_URL}/PgPeekIn/pgs/${pgData.pgid}/rooms`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const roomContentType =
          roomResponse.headers.get("content-type");

        const roomData =
          roomContentType?.includes("application/json")
            ? await roomResponse.json()
            : await roomResponse.text();

        if (!roomResponse.ok) {
          throw new Error(
            typeof roomData === "string"
              ? roomData
              : "Failed to fetch rooms"
          );
        }

        console.log("ROOMS =", roomData);

        setRooms(
          Array.isArray(roomData)
            ? roomData
            : []
        );

      } catch (err) {
        console.error(
          "MANAGE ROOMS ERROR =",
          err
        );

        setError(
          err.message ||
          "Failed to load rooms"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // ==================================================
  // ADD ROOM
  // ==================================================

  const handleRoomChange = (e) => {
    const { name, value } = e.target;

    setRoomForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!pg?.pgid) {
      alert("PG information is not available");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      setSavingRoom(true);

      const response = await fetch(
        `${API_BASE_URL}/PgPeekIn/pgs/${pg.pgid}/rooms`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            roomNo: roomForm.roomNo.trim(),
            category: roomForm.category,
            sharingType: Number(
              roomForm.sharingType
            ),
            monthlyRent: Number(
              roomForm.monthlyRent
            ),
            dailyRent: Number(
              roomForm.dailyRent
            ),
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              "Failed to add room"
        );
      }

      setRooms((prev) => [
        ...prev,
        data,
      ]);

      setRoomForm({
        roomNo: "",
        category: "Non-AC",
        sharingType: "2",
        monthlyRent: "",
        dailyRent: "",
      });

      setShowAddRoom(false);

      alert("Room added successfully!");

    } catch (err) {
      console.error(
        "ADD ROOM ERROR =",
        err
      );

      alert(
        err.message ||
        "Failed to add room"
      );

    } finally {
      setSavingRoom(false);
    }
  };

  // ==================================================
  // EDIT ROOM
  // ==================================================

  const handleEditClick = (room) => {
    setEditingRoom(room);

    setEditRoomForm({
      roomNo: room.roomNo || "",

      category:
        room.category || "Non-AC",

      sharingType:
        String(room.sharingType || "1"),

      monthlyRent:
        room.monthlyRent !== null &&
        room.monthlyRent !== undefined
          ? String(room.monthlyRent)
          : "",

      dailyRent:
        room.dailyRent !== null &&
        room.dailyRent !== undefined
          ? String(room.dailyRent)
          : "",
    });

    setShowEditRoom(true);
  };

  // ==================================================
  // EDIT FORM CHANGE
  // ==================================================

  const handleEditRoomChange = (e) => {
    const { name, value } = e.target;

    setEditRoomForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // CLOSE EDIT MODAL
  // ==================================================

  const closeEditRoom = () => {
    if (savingEdit) {
      return;
    }

    setShowEditRoom(false);
    setEditingRoom(null);

    setEditRoomForm({
      roomNo: "",
      category: "Non-AC",
      sharingType: "1",
      monthlyRent: "",
      dailyRent: "",
    });
  };

  // ==================================================
  // UPDATE ROOM
  // ==================================================

  const handleUpdateRoom = async (e) => {
    e.preventDefault();

    if (!pg?.pgid) {
      alert("PG information is not available");
      return;
    }

    if (!editingRoom?.roomId) {
      alert("Room information is not available");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!editRoomForm.roomNo.trim()) {
      alert("Please enter room number");
      return;
    }

    if (
      editRoomForm.monthlyRent === "" ||
      Number(editRoomForm.monthlyRent) < 0
    ) {
      alert("Please enter a valid monthly rent");
      return;
    }

    if (
      editRoomForm.dailyRent === "" ||
      Number(editRoomForm.dailyRent) < 0
    ) {
      alert("Please enter a valid daily rent");
      return;
    }

    try {
      setSavingEdit(true);

      // --------------------------------------------------
      // PUT REQUEST
      // --------------------------------------------------

      const response = await fetch(
        `${API_BASE_URL}/PgPeekIn/pgs/${pg.pgid}/rooms/${editingRoom.roomId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            roomNo:
              editRoomForm.roomNo.trim(),

            category:
              editRoomForm.category,

            // IMPORTANT:
            // Keep the original sharing type.
            sharingType:
              Number(editingRoom.sharingType),

            monthlyRent:
              Number(
                editRoomForm.monthlyRent
              ),

            dailyRent:
              Number(
                editRoomForm.dailyRent
              ),
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              "Failed to update room"
        );
      }

      // --------------------------------------------------
      // UPDATE ROOM IN UI
      // --------------------------------------------------

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomId === data.roomId
            ? data
            : room
        )
      );

      closeEditRoom();

      alert(
        "Room updated successfully!"
      );

    } catch (err) {
      console.error(
        "UPDATE ROOM ERROR =",
        err
      );

      alert(
        err.message ||
        "Failed to update room"
      );

    } finally {
      setSavingEdit(false);
    }
  };

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return (
      <div className="manage-rooms-layout">

        <aside className="owner-sidebar">

          <div className="owner-brand">
            <h2>PGPeekIn</h2>
            <p>Owner Panel</p>
          </div>

          <nav className="owner-menu">

            <Link
              to="/owner-dashboard"
              className="owner-menu-item"
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
              className="owner-menu-item active"
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

          </nav>

          <Link
            to="/login"
            className="owner-logout"
          >
            🚪 Logout
          </Link>

        </aside>

        <main className="manage-rooms-main">
          <h1>Manage Rooms</h1>
          <p>Loading rooms...</p>
        </main>

      </div>
    );
  }

  // ==================================================
  // ERROR STATE
  // ==================================================

  if (error) {
    return (
      <div className="manage-rooms-layout">

        <aside className="owner-sidebar">

          <div className="owner-brand">
            <h2>PGPeekIn</h2>
            <p>Owner Panel</p>
          </div>

          <nav className="owner-menu">

            <Link
              to="/owner-dashboard"
              className="owner-menu-item"
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
              className="owner-menu-item active"
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

          </nav>

          <Link
            to="/login"
            className="owner-logout"
          >
            🚪 Logout
          </Link>

        </aside>

        <main className="manage-rooms-main">

          <h1>Manage Rooms</h1>

          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>

        </main>

      </div>
    );
  }

  // ==================================================
  // SUMMARY CALCULATIONS
  // ==================================================

  const totalRooms = rooms.length;

  const totalSlots = rooms.reduce(
    (sum, room) =>
      sum +
      Number(room.sharingType || 0),
    0
  );

  /*
   * Temporary availability calculation.
   *
   * Total slots = sharingType
   * Occupied slots = 0
   * Available slots = total slots
   *
   * This will be replaced with actual
   * slot_allocation data later.
   */

  const occupiedSlots = 0;

  const availableSlots =
    totalSlots - occupiedSlots;

  const occupancyPercentage =
    totalSlots > 0
      ? Math.round(
          (occupiedSlots /
            totalSlots) *
            100
        )
      : 0;

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="manage-rooms-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="owner-sidebar">

        <div className="owner-brand">
          <h2>PGPeekIn</h2>
          <p>Owner Panel</p>
        </div>

        <nav className="owner-menu">

          <Link
            to="/owner-dashboard"
            className="owner-menu-item"
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
            className="owner-menu-item active"
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

        </nav>

        <Link
          to="/login"
          className="owner-logout"
        >
          🚪 Logout
        </Link>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="manage-rooms-main">

        {/* ================= HEADER ================= */}

        <div className="rooms-header">

          <div>

            <h1>
              Manage Rooms
            </h1>

            <p>
              Manage rooms, sharing types
              and slot availability.
            </p>

          </div>

          <button
            className="add-room-btn"
            type="button"
            onClick={() =>
              setShowAddRoom(true)
            }
            disabled={!pg}
          >
            + Add Room
          </button>

        </div>

        {/* ================= PG SELECTOR ================= */}

        <section className="pg-selector-section">

          <div className="pg-selector-left">

            <label>
              Select PG
            </label>

            <select
              value={pg?.pgname || ""}
              disabled
            >
              <option
                value={pg?.pgname || ""}
              >
                {pg?.pgname || "No PG"}
              </option>
            </select>

          </div>

          <div className="selected-pg-info">

            <span>
              Currently managing
            </span>

            <strong>
              {pg?.pgname}
            </strong>

          </div>

        </section>

        {/* ================= SUMMARY ================= */}

        <section className="room-summary">

          <div className="room-summary-card">

            <div className="summary-icon">
              🛏️
            </div>

            <div>

              <p>
                Total Rooms
              </p>

              <h2>
                {totalRooms}
              </h2>

            </div>

          </div>

          <div className="room-summary-card">

            <div className="summary-icon available-icon">
              🟢
            </div>

            <div>

              <p>
                Available Slots
              </p>

              <h2>
                {availableSlots}
              </h2>

            </div>

          </div>

          <div className="room-summary-card">

            <div className="summary-icon occupied-icon">
              👥
            </div>

            <div>

              <p>
                Occupied Slots
              </p>

              <h2>
                {occupiedSlots}
              </h2>

            </div>

          </div>

          <div className="room-summary-card">

            <div className="summary-icon">
              🛏️
            </div>

            <div>

              <p>
                Total Slots
              </p>

              <h2>
                {totalSlots}
              </h2>

            </div>

          </div>

        </section>

        {/* ================= SLOT AVAILABILITY ================= */}

        <section className="availability-section">

          <div className="availability-header">

            <div>

              <h2>
                Slot Availability
              </h2>

              <p>
                Current occupancy across all
                rooms
              </p>

            </div>

            <div className="availability-percentage">

              <strong>
                {occupancyPercentage}%
              </strong>

              <span>
                Occupied
              </span>

            </div>

          </div>

          <div className="availability-bar">

            <div
              className="occupied-bar"
              style={{
                width:
                  `${occupancyPercentage}%`,
              }}
            />

          </div>

          <div className="availability-details">

            <div className="availability-item">

              <span className="availability-dot occupied-dot"></span>

              <div>

                <strong>
                  {occupiedSlots}
                </strong>

                <span>
                  Occupied Slots
                </span>

              </div>

            </div>

            <div className="availability-item">

              <span className="availability-dot available-dot"></span>

              <div>

                <strong>
                  {availableSlots}
                </strong>

                <span>
                  Available Slots
                </span>

              </div>

            </div>

            <div className="availability-item">

              <span className="availability-dot total-dot"></span>

              <div>

                <strong>
                  {totalSlots}
                </strong>

                <span>
                  Total Slots
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ================= ROOMS ================= */}

        <section className="rooms-section">

          <div className="rooms-section-header">

            <div>

              <h2>
                Rooms
              </h2>

              <p>
                Rooms available in{" "}
                {pg?.pgname}
              </p>

            </div>

          </div>

          <div className="rooms-table-container">

            <table className="rooms-table">

              <thead>

                <tr>

                  <th>
                    Room
                  </th>

                  <th>
                    Sharing
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Total Slots
                  </th>

                  <th>
                    Available
                  </th>

                  <th>
                    Occupied
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {rooms.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                      }}
                    >
                      No rooms have been
                      added yet.
                    </td>

                  </tr>

                ) : (

                  rooms.map((room) => {

                    const roomTotalSlots =
                      Number(
                        room.sharingType ||
                        0
                      );

                    /*
                     * Temporary values.
                     * These will come from
                     * slot/allocation data later.
                     */

                    const roomOccupiedSlots =
                      0;

                    const roomAvailableSlots =
                      roomTotalSlots -
                      roomOccupiedSlots;

                    return (

                      <tr
                        key={
                          room.roomId
                        }
                      >

                        {/* ROOM */}

                        <td>

                          <div className="room-number">

                            <div className="room-icon">
                              🛏️
                            </div>

                            <span className="room-number-text">
                              Room {room.roomNo}
                            </span>

                          </div>

                        </td>

                        {/* SHARING */}

                        <td>

                          <span className="sharing-badge">
                            {room.sharingType}{" "}
                            Sharing
                          </span>

                        </td>

                        {/* TYPE */}

                        <td>

                          <span
                            className={`room-type ${
                              room.category ===
                              "AC"
                                ? "ac-type"
                                : "non-ac-type"
                            }`}
                          >
                            {room.category}
                          </span>

                        </td>

                        {/* TOTAL SLOTS */}

                        <td>

                          <span className="slot-count">
                            {
                              roomTotalSlots
                            }
                          </span>

                        </td>

                        {/* AVAILABLE */}

                        <td>

                          <span className="available-text">
                            {
                              roomAvailableSlots
                            }
                          </span>

                        </td>

                        {/* OCCUPIED */}

                        <td>

                          <span className="occupied-text">
                            {
                              roomOccupiedSlots
                            }
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          {roomAvailableSlots >
                          0 ? (

                            <span className="room-status available">
                              Available
                            </span>

                          ) : (

                            <span className="room-status full">
                              Full
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="edit-room-btn"
                            type="button"
                            onClick={() =>
                              handleEditClick(
                                room
                              )
                            }
                          >
                            Edit
                          </button>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ================= SLOT INFORMATION ================= */}

        <section className="slot-info-section">

          <div className="slot-info-icon">
            💡
          </div>

          <div>

            <h3>
              How slot availability works
            </h3>

            <p>
              Each room's sharing type
              determines the number of
              slots. For example, a
              2-sharing room has 2 slots.
              When a tenant occupies a
              slot, the available slot
              count decreases automatically.
            </p>

          </div>

        </section>

        {/* ================= ADD ROOM MODAL ================= */}

        {showAddRoom && (

          <div
            className="room-modal-overlay"
            onMouseDown={(e) => {

              if (
                e.target ===
                e.currentTarget
              ) {
                setShowAddRoom(false);
              }

            }}
          >

            <div className="room-modal">

              <div className="room-modal-header">

                <div>

                  <h2>
                    Add New Room
                  </h2>

                  <p>
                    Add a room to{" "}
                    {pg?.pgname}
                  </p>

                </div>

                <button
                  type="button"
                  className="close-modal-btn"
                  onClick={() =>
                    setShowAddRoom(false)
                  }
                >
                  ×
                </button>

              </div>

              <form
                className="room-form"
                onSubmit={handleAddRoom}
              >

                <div className="room-form-grid">

                  {/* ROOM NUMBER */}

                  <div className="room-form-group">

                    <label htmlFor="roomNo">
                      Room Number
                    </label>

                    <input
                      id="roomNo"
                      name="roomNo"
                      type="text"
                      placeholder="Example: 101"
                      value={
                        roomForm.roomNo
                      }
                      onChange={
                        handleRoomChange
                      }
                      required
                    />

                  </div>

                  {/* ROOM TYPE */}

                  <div className="room-form-group">

                    <label htmlFor="category">
                      Room Type
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={
                        roomForm.category
                      }
                      onChange={
                        handleRoomChange
                      }
                      required
                    >

                      <option value="AC">
                        AC
                      </option>

                      <option value="Non-AC">
                        Non-AC
                      </option>

                    </select>

                  </div>

                  {/* SHARING TYPE */}

                  <div className="room-form-group">

                    <label htmlFor="sharingType">
                      Sharing Type
                    </label>

                    <select
                      id="sharingType"
                      name="sharingType"
                      value={
                        roomForm.sharingType
                      }
                      onChange={
                        handleRoomChange
                      }
                      required
                    >

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

                  {/* MONTHLY RENT */}

                  <div className="room-form-group">

                    <label htmlFor="monthlyRent">
                      Monthly Rent (₹)
                    </label>

                    <input
                      id="monthlyRent"
                      name="monthlyRent"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Example: 6500"
                      value={
                        roomForm.monthlyRent
                      }
                      onChange={
                        handleRoomChange
                      }
                      required
                    />

                  </div>

                  {/* DAILY RENT */}

                  <div className="room-form-group">

                    <label htmlFor="dailyRent">
                      Daily Rent (₹)
                    </label>

                    <input
                      id="dailyRent"
                      name="dailyRent"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Example: 300"
                      value={
                        roomForm.dailyRent
                      }
                      onChange={
                        handleRoomChange
                      }
                      required
                    />

                  </div>

                </div>

                <div className="room-slot-note">

                  <span>
                    💡
                  </span>

                  <p>

                    <strong>
                      {
                        roomForm.sharingType
                      }{" "}
                      slots
                    </strong>{" "}
                    will be created
                    automatically for this
                    room.

                  </p>

                </div>

                <div className="room-form-actions">

                  <button
                    type="button"
                    className="cancel-room-btn"
                    onClick={() =>
                      setShowAddRoom(false)
                    }
                    disabled={
                      savingRoom
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-room-btn"
                    disabled={
                      savingRoom
                    }
                  >
                    {savingRoom
                      ? "Saving..."
                      : "Save Room"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* ================= EDIT ROOM MODAL ================= */}

        {showEditRoom &&
          editingRoom && (

            <div
              className="room-modal-overlay"
              onMouseDown={(e) => {

                if (
                  e.target ===
                    e.currentTarget &&
                  !savingEdit
                ) {
                  closeEditRoom();
                }

              }}
            >

              <div className="room-modal">

                {/* HEADER */}

                <div className="room-modal-header">

                  <div>

                    <h2>
                      Edit Room
                    </h2>

                    <p>
                      Update details for
                      Room{" "}
                      {
                        editingRoom.roomNo
                      }
                    </p>

                  </div>

                  <button
                    type="button"
                    className="close-modal-btn"
                    onClick={
                      closeEditRoom
                    }
                    disabled={
                      savingEdit
                    }
                  >
                    ×
                  </button>

                </div>

                {/* FORM */}

                <form
                  className="room-form"
                  onSubmit={
                    handleUpdateRoom
                  }
                >

                  <div className="room-form-grid">

                    {/* ROOM NUMBER */}

                    <div className="room-form-group">

                      <label htmlFor="editRoomNo">
                        Room Number
                      </label>

                      <input
                        id="editRoomNo"
                        name="roomNo"
                        type="text"
                        placeholder="Example: 101"
                        value={
                          editRoomForm.roomNo
                        }
                        onChange={
                          handleEditRoomChange
                        }
                        required
                      />

                    </div>

                    {/* ROOM TYPE */}

                    <div className="room-form-group">

                      <label htmlFor="editCategory">
                        Room Type
                      </label>

                      <select
                        id="editCategory"
                        name="category"
                        value={
                          editRoomForm.category
                        }
                        onChange={
                          handleEditRoomChange
                        }
                        required
                      >

                        <option value="AC">
                          AC
                        </option>

                        <option value="Non-AC">
                          Non-AC
                        </option>

                      </select>

                    </div>

                    {/* SHARING TYPE */}

                    <div className="room-form-group">

                      <label htmlFor="editSharingType">
                        Sharing Type
                      </label>

                      <select
                        id="editSharingType"
                        name="sharingType"
                        value={
                          editRoomForm.sharingType
                        }
                        disabled
                      >

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

                    {/* MONTHLY RENT */}

                    <div className="room-form-group">

                      <label htmlFor="editMonthlyRent">
                        Monthly Rent (₹)
                      </label>

                      <input
                        id="editMonthlyRent"
                        name="monthlyRent"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Example: 6500"
                        value={
                          editRoomForm.monthlyRent
                        }
                        onChange={
                          handleEditRoomChange
                        }
                        required
                      />

                    </div>

                    {/* DAILY RENT */}

                    <div className="room-form-group">

                      <label htmlFor="editDailyRent">
                        Daily Rent (₹)
                      </label>

                      <input
                        id="editDailyRent"
                        name="dailyRent"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Example: 300"
                        value={
                          editRoomForm.dailyRent
                        }
                        onChange={
                          handleEditRoomChange
                        }
                        required
                      />

                    </div>

                  </div>

                  {/* SHARING TYPE NOTE */}

                  <div className="room-slot-note edit-sharing-note">

                    <span>
                      🔒
                    </span>

                    <p>

                      <strong>
                        {
                          editingRoom.sharingType
                        }{" "}
                        Sharing
                      </strong>{" "}
                      cannot be changed
                      here because it
                      controls the room's
                      database slots.

                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="room-form-actions">

                    <button
                      type="button"
                      className="cancel-room-btn"
                      onClick={
                        closeEditRoom
                      }
                      disabled={
                        savingEdit
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-room-btn"
                      disabled={
                        savingEdit
                      }
                    >
                      {savingEdit
                        ? "Updating..."
                        : "Update Room"}
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

      </main>

    </div>
  );
}

export default ManageRooms;