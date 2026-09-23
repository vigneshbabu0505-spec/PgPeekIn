import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/EditPG.css";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function EditPG() {
  const { pgid } = useParams();

  // =====================================================
  // STATE
  // =====================================================

  const [pg, setPg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    pgname: "",
    pgtype: "",
    pgbranch: "",
    pgphnno: "",
    street: "",
    area: "",
    city: "",
    pincode: "",
  });

  // =====================================================
  // FETCH PG + PHOTOS
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        // =================================================
        // 1. GET LOGGED-IN OWNER'S PG
        // =================================================

        const pgResponse = await fetch(
          `${API}/pgowner/my-pg`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle JSON / text response
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
            "You have not added a PG yet."
          );
        }

        console.log("EDIT PG =", pgData);

        // =================================================
        // 2. VERIFY PG ID
        // =================================================

        if (
          Number(pgData.pgid) !== Number(pgid)
        ) {
          throw new Error(
            "You do not have access to this PG."
          );
        }

        // =================================================
        // 3. STORE PG
        // =================================================

        setPg(pgData);

        // =================================================
        // 4. SET FORM VALUES
        // =================================================

        setFormData({
          pgname: pgData.pgname || "",
          pgtype: pgData.pgtype || "",
          pgbranch: pgData.pgbranch || "",
          pgphnno: pgData.pgphnno || "",
          street: pgData.street || "",
          area: pgData.area || "",
          city: pgData.city || "",
          pincode: pgData.pincode || "",
        });

        // =================================================
        // 5. GET PG PHOTOS
        // =================================================

        const photoResponse = await fetch(
          `${API}/pgowner/photos/${pgid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (photoResponse.ok) {
          const photoData =
            await photoResponse.json();

          console.log(
            "EDIT PG PHOTOS =",
            photoData
          );

          // Sort by photo ID so the oldest photo
          // remains the main photo.
          const sortedPhotos =
            Array.isArray(photoData)
              ? [...photoData].sort(
                  (a, b) =>
                    Number(a.photoid || 0) -
                    Number(b.photoid || 0)
                )
              : [];

          setPhotos(sortedPhotos);
        } else {
          console.warn(
            "Could not load PG photos"
          );

          setPhotos([]);
        }
      } catch (err) {
        console.error(
          "EDIT PG ERROR =",
          err
        );

        setError(
          err.message ||
            "Failed to load PG"
        );
      } finally {
        setLoading(false);
      }
    };

    if (pgid) {
      fetchData();
    }
  }, [pgid]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // PHOTO SELECTION
  // =====================================================

  const handlePhotoChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    setSelectedFiles(files);
  };

  // =====================================================
  // UPDATE PG DETAILS
  // =====================================================

  const handleSaveDetails = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again"
        );
      }

      // =================================================
      // UPDATE PG
      // =================================================

      const response = await fetch(
        `${API}/pgowner/updatepg/${pgid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      // Handle JSON / text response
      const contentType =
        response.headers.get(
          "content-type"
        );

      const data =
        contentType?.includes(
          "application/json"
        )
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Failed to update PG"
        );
      }

      console.log(
        "UPDATED PG =",
        data
      );

      // =================================================
      // UPDATE LOCAL STATE
      // =================================================

      if (
        typeof data === "object" &&
        data !== null
      ) {
        setPg(data);
      } else {
        setPg((prev) => ({
          ...prev,
          ...formData,
        }));
      }

      alert(
        "PG details updated successfully!"
      );
    } catch (err) {
      console.error(
        "UPDATE PG ERROR =",
        err
      );

      setError(
        err.message ||
          "Failed to update PG"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UPLOAD PHOTOS
  // =====================================================

  const handleUploadPhotos = async () => {
    if (
      selectedFiles.length === 0
    ) {
      alert(
        "Please select at least one photo."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login again"
        );
      }

      // =================================================
      // CREATE MULTIPART FORM DATA
      // =================================================

      const uploadData =
        new FormData();

      selectedFiles.forEach(
        (file) => {
          uploadData.append(
            "images",
            file
          );
        }
      );

      // =================================================
      // UPLOAD
      // =================================================

      const response = await fetch(
        `${API}/pgowner/photos/${pgid}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          // IMPORTANT:
          // Do NOT set Content-Type manually.
          // Browser automatically creates the
          // multipart/form-data boundary.
          body: uploadData,
        }
      );

      // =================================================
      // HANDLE RESPONSE
      // =================================================

      const contentType =
        response.headers.get(
          "content-type"
        );

      const data =
        contentType?.includes(
          "application/json"
        )
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Failed to upload photos"
        );
      }

      console.log(
        "PHOTO UPLOAD RESPONSE =",
        data
      );

      alert(
        "Photos uploaded successfully!"
      );

      // =================================================
      // CLEAR SELECTED FILES
      // =================================================

      setSelectedFiles([]);

      const fileInput =
        document.getElementById(
          "pg-photo-input"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      // =================================================
      // REFRESH PHOTO LIST
      // =================================================

      const photoResponse =
        await fetch(
          `${API}/pgowner/photos/${pgid}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (photoResponse.ok) {
        const photoData =
          await photoResponse.json();

        const sortedPhotos =
          Array.isArray(photoData)
            ? [...photoData].sort(
                (a, b) =>
                  Number(
                    a.photoid || 0
                  ) -
                  Number(
                    b.photoid || 0
                  )
              )
            : [];

        setPhotos(
          sortedPhotos
        );
      }
    } catch (err) {
      console.error(
        "UPLOAD PHOTO ERROR =",
        err
      );

      setError(
        err.message ||
          "Failed to upload photos"
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="edit-pg-layout">

        <main className="edit-pg-main">

          <h1>
            Loading PG...
          </h1>

          <p>
            Please wait while we load
            your PG details.
          </p>

        </main>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !pg) {
    return (
      <div className="edit-pg-layout">

        <main className="edit-pg-main">

          <h1>
            Unable to load PG
          </h1>

          <p className="edit-pg-error">
            {error}
          </p>

          <Link
            to="/owner/my-pgs"
            className="back-btn"
          >
            ← Back to My PGs
          </Link>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="edit-pg-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="owner-sidebar">

        <div className="sidebar-logo">

          <div className="logo-box">
            P
          </div>

          <span>
            PGPeekIn
          </span>

        </div>

        <nav className="sidebar-nav">

          <Link to="/owner-dashboard">
            <span>📊</span>
            Dashboard
          </Link>

          <Link
            to="/owner/my-pgs"
            className="active"
          >
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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="edit-pg-main">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="edit-pg-header">

          <div>

            <h1>
              Edit PG
            </h1>

            <p>
              Update your PG details
              and manage property photos.
            </p>

          </div>

          <Link
            to="/owner/my-pgs"
            className="back-btn"
          >
            ← Back to My PGs
          </Link>

        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="edit-pg-error">
            {error}
          </div>
        )}

        {/* =================================================
            PG INFORMATION
        ================================================= */}

        <form
          className="edit-pg-card"
          onSubmit={
            handleSaveDetails
          }
        >

          <div className="section-heading">

            <h2>
              PG Information
            </h2>

            <p>
              Update the basic information
              of your property.
            </p>

          </div>

          <div className="edit-form-grid">

            {/* PG NAME */}

            <div className="form-group">

              <label>
                PG Name
              </label>

              <input
                type="text"
                name="pgname"
                value={
                  formData.pgname
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* PG TYPE */}

            <div className="form-group">

              <label>
                PG Type
              </label>

              <select
                name="pgtype"
                value={
                  formData.pgtype
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="">
                  Select PG Type
                </option>

                <option value="Mens">
                  Mens
                </option>

                <option value="female">
                  Female
                </option>

              </select>

            </div>

            {/* BRANCH */}

            <div className="form-group">

              <label>
                Branch
              </label>

              <input
                type="text"
                name="pgbranch"
                value={
                  formData.pgbranch
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone
              </label>

              <input
                type="tel"
                name="pgphnno"
                value={
                  formData.pgphnno
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* STREET */}

            <div className="form-group">

              <label>
                Street
              </label>

              <input
                type="text"
                name="street"
                value={
                  formData.street
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* AREA */}

            <div className="form-group">

              <label>
                Area
              </label>

              <input
                type="text"
                name="area"
                value={
                  formData.area
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* CITY */}

            <div className="form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* PINCODE */}

            <div className="form-group">

              <label>
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={
                  formData.pincode
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          </div>

          {/* FORM BUTTONS */}

          <div className="form-actions">

            <Link
              to="/owner/my-pgs"
              className="cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save PG Details"}
            </button>

          </div>

        </form>

        {/* =================================================
            PG PHOTOS
        ================================================= */}

        <section className="edit-pg-card">

          <div className="section-heading">

            <h2>
              PG Photos
            </h2>

            <p>
              The first photo is displayed
              as the main photo of your PG.
            </p>

          </div>

          {/* =================================================
              EXISTING PHOTOS
          ================================================= */}

          <div className="photo-gallery">

            {photos.length === 0 ? (

              <div className="no-photos">

                <span>
                  📷
                </span>

                <p>
                  No photos uploaded yet.
                </p>

              </div>

            ) : (

              photos.map(
                (photo, index) => (

                  <div
                    className={
                      `photo-item ${
                        index === 0
                          ? "primary-photo"
                          : ""
                      }`
                    }
                    key={
                      photo.photoid
                    }
                  >

                    <img
                      src={
                        photo.photoPath
                      }
                      alt={
                        `PG ${
                          index + 1
                        }`
                      }
                      onError={(e) => {
                        console.error(
                          "PHOTO LOAD ERROR:",
                          photo.photoPath
                        );

                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                    {index === 0 && (
                      <span className="primary-badge">
                        Main Photo
                      </span>
                    )}

                  </div>

                )
              )

            )}

          </div>

          {/* =================================================
              UPLOAD NEW PHOTOS
          ================================================= */}

          <div className="upload-section">

            <label
              htmlFor="pg-photo-input"
              className="upload-box"
            >

              <div className="upload-icon">
                📷
              </div>

              <strong>
                Add More Photos
              </strong>

              <span>
                Select multiple photos
                from your computer
              </span>

            </label>

            <input
              id="pg-photo-input"
              type="file"
              accept="image/*"
              multiple
              onChange={
                handlePhotoChange
              }
              className="hidden-file-input"
            />

            {/* =================================================
                SELECTED FILES
            ================================================= */}

            {selectedFiles.length >
              0 && (

              <div className="selected-files">

                <h3>
                  Selected Photos (
                  {
                    selectedFiles.length
                  }
                  )
                </h3>

                {selectedFiles.map(
                  (file, index) => (

                    <div
                      className="selected-file"
                      key={`${file.name}-${index}`}
                    >

                      <span>
                        🖼️
                      </span>

                      <span>
                        {file.name}
                      </span>

                      <span>
                        {
                          (
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)
                        }{" "}
                        MB
                      </span>

                    </div>

                  )
                )}

                {/* UPLOAD BUTTON */}

                <button
                  type="button"
                  className="upload-btn"
                  onClick={
                    handleUploadPhotos
                  }
                  disabled={
                    uploading
                  }
                >
                  {uploading
                    ? "Uploading..."
                    : `Upload ${
                        selectedFiles.length
                      } Photo${
                        selectedFiles.length >
                        1
                          ? "s"
                          : ""
                      }`}
                </button>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default EditPG;