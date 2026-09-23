import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/AddPG.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function AddPG() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pgName: "",
    pgType: "",
    pgBranch: "",
    phone: "",
    street: "",
    area: "",
    city: "",
    pincode: "",
    description: "",
  });

  const [facilities, setFacilities] = useState([]);

  const [photos, setPhotos] = useState([]);

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const facilityOptions = [
    "Wi-Fi",
    "Food",
    "Laundry",
    "Parking",
    "AC",
    "CCTV",
    "Power Backup",
    "Housekeeping",
  ];

  // =========================
  // HANDLE TEXT INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE FACILITIES
  // =========================
  const handleFacilityChange = (facility) => {
    if (facilities.includes(facility)) {
      setFacilities(
        facilities.filter((item) => item !== facility)
      );
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  // =========================
  // HANDLE IMAGE SELECTION
  // =========================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setImages(selectedFiles);
  };

  // =========================
  // SUBMIT PG
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log("PG Details:", formData);
    console.log("Facilities:", facilities);
    console.log("PG Photos:", photos);

    setError("");



    // Get JWT token
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    // Backend currently expects images
    if (images.length === 0) {
      setError("Please upload at least one PG photo.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // These names MUST match @RequestParam names
      // in PgController.java

      data.append("pgname", formData.pgName);
      data.append("pgtype", formData.pgType);
      data.append("pgbranch", formData.pgBranch);
      data.append("pgphnno", formData.phone);
      data.append("street", formData.street);
      data.append("area", formData.area);
      data.append("city", formData.city);
      data.append("pincode", formData.pincode);

      // Add images
      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await fetch(
        `${API_BASE_URL}/pgowner/addpg`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || "Failed to add PG"
        );
      }

      console.log("PG added successfully:", responseText);

      alert("PG added successfully!");

      // Go to My PGs
      navigate("/owner/my-pgs");

    } catch (err) {
      console.error("ADD PG ERROR:", err);

      setError(
        err.message || "Something went wrong while adding the PG."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pg-layout">

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
            className="owner-menu-item active"
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

        </nav>

        <button className="owner-logout">
          🚪 Logout
        </button>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="add-pg-main">

        <div className="add-pg-header">
          <div>
            <h1>Add New PG</h1>
            <p>
              Add your PG property and make it available
              for tenants.
            </p>
          </div>
        </div>


        {/* ================= FORM ================= */}
        <form
          className="add-pg-form"
          onSubmit={handleSubmit}
        >

          {/* ================= BASIC INFORMATION ================= */}
          <section className="form-section">

            <div className="form-section-title">
              <h2>Basic Information</h2>
              <p>
                Enter the basic details of your PG.
              </p>
            </div>

            <div className="form-grid">

              {/* PG NAME */}
              <div className="form-group">
                <label>PG Name</label>

                <input
                  type="text"
                  name="pgName"
                  placeholder="Enter PG name"
                  value={formData.pgName}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* PG TYPE */}
              <div className="form-group">
                <label>PG Type</label>

                <select
                  name="pgType"
                  value={formData.pgType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select PG Type
                  </option>

                  <option value="Mens">
                    Men's PG
                  </option>

                  <option value="female">
                    Women's PG
                  </option>
                </select>
              </div>


              {/* BRANCH */}
              <div className="form-group">
                <label>Branch</label>

                <input
                  type="text"
                  name="pgBranch"
                  placeholder="e.g. Chennai Branch"
                  value={formData.pgBranch}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* PHONE */}
              <div className="form-group">
                <label>Contact Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter contact number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* STREET */}
              <div className="form-group full-width">
                <label>Street</label>

                <input
                  type="text"
                  name="street"
                  placeholder="Enter street / door address"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* AREA */}
              <div className="form-group">
                <label>Area</label>

                <input
                  type="text"
                  name="area"
                  placeholder="e.g. Tambaram"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* CITY */}
              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Chennai"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>


              {/* PINCODE */}
              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 600001"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  required
                />
              </div>


              {/* DESCRIPTION */}
              <div className="form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Describe your PG..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                ></textarea>

                <small>
                  Description is currently for the UI only
                  and is not stored in the database.
                </small>
              </div>

            </div>

          </section>


          {/* ================= FACILITIES ================= */}
          <section className="form-section">

            <div className="form-section-title">
              <h2>Facilities</h2>

              <p>
                Select the facilities available in your PG.
              </p>
            </div>

            <div className="facility-grid">

              {facilityOptions.map((facility) => (

                <label
                  className={`facility-option ${
                    facilities.includes(facility)
                      ? "selected"
                      : ""
                  }`}
                  key={facility}
                >

                  <input
                    type="checkbox"
                    checked={facilities.includes(facility)}
                    onChange={() =>
                      handleFacilityChange(facility)
                    }
                  />

                  <span>{facility}</span>

                </label>

              ))}

            </div>

            <small>
              Facilities are currently for the UI only
              and are not stored in the database yet.
            </small>

          </section>


          {/* ================= PHOTOS ================= */}
          <section className="form-section">

            <div className="form-section-title">
              <h2>PG Photos</h2>

              <p>
                Add photos of your PG property.
              </p>
            </div>


            <div className="photo-upload">

              <div className="upload-icon">
                📷
              </div>

              <h3>
                Upload PG Photos
              </h3>

              <p>
                Add photos to help tenants understand
                your property.
              </p>


              <input

  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setPhotos(Array.from(e.target.files))}

                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
              />


              {/* SHOW SELECTED FILES */}
              {images.length > 0 && (
                <div style={{ marginTop: "15px" }}>

                  <p>
                    <strong>
                      {images.length} photo(s) selected
                    </strong>
                  </p>

                  <ul>
                    {images.map((image, index) => (
                      <li key={index}>
                        {image.name}
                      </li>
                    ))}
                  </ul>

                </div>
              )}

            </div>

          </section>


          {/* ================= ERROR ================= */}
          {error && (
            <div
              style={{
                color: "red",
                background: "#ffecec",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          )}


          {/* ================= BUTTONS ================= */}
          <div className="form-actions">

            <Link
              to="/owner/my-pgs"
              className="cancel-btn"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="save-pg-btn"
              disabled={loading}
            >

              {loading
                ? "Adding PG..."
                : "Add PG"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AddPG;