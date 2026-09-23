import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function TenantProfile() {

  // ================= PROFILE DATA =================
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    occupation: "",
    role: ""
  });

  // ================= LOADING =================
  const [loading, setLoading] = useState(true);

  // ================= ERROR =================
  const [error, setError] = useState("");

  // ================= EDIT POPUP =================
  const [showEdit, setShowEdit] = useState(false);

  // ================= TEMP FORM DATA =================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    occupation: ""
  });

  // =====================================================
  // FETCH LOGGED-IN USER PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {

        const response = await fetch(
          `${API_BASE_URL}/PgPeekIn/users/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {

          if (response.status === 401) {
            throw new Error("Session expired. Please login again.");
          }

          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();

        console.log("Profile data:", data);

        // Backend field names → frontend field names
        const profileData = {
          name: data.user_name || "",
          email: data.email || "",
          phone: data.user_phone || "",
          gender: data.gender || "",
          occupation: data.occupation || "",
          role: data.role || ""
        };

        setProfile(profileData);

        setFormData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          gender: profileData.gender,
          occupation: profileData.occupation
        });

      } catch (err) {

        console.error("Profile error:", err);
        setError(err.message);

      } finally {

        setLoading(false);
      }
    };

    fetchProfile();

  }, []);

  // =====================================================
  // OPEN EDIT POPUP
  // =====================================================

  const handleEdit = () => {

    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      occupation: profile.occupation
    });

    setShowEdit(true);
  };

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/PgPeekIn/users/profile/update`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            user_name: formData.name,
            user_phone: formData.phone,
            gender: formData.gender,
            occupation: formData.occupation
          })
        }
      );

      const result = await response.text();

      console.log("Update response:", result);

      if (!response.ok) {
        throw new Error(result || "Failed to update profile.");
      }

      // Update screen immediately
      setProfile({
        ...profile,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        occupation: formData.occupation
      });

      setShowEdit(false);

      alert("Profile updated successfully.");

    } catch (err) {

      console.error("Profile update error:", err);

      alert(err.message);
    }
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = () => {

    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      occupation: profile.occupation
    });

    setShowEdit(false);
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (
      <div className="tenant-page">

        <aside className="tenant-sidebar">

          <div className="tenant-brand">

            <img src={logo} alt="PGPeekIn" />

            <div>
              <h2>PGPeekIn</h2>
              <p>Tenant panel</p>
            </div>

          </div>

        </aside>

        <main className="tenant-main">

          <div style={{ padding: "40px" }}>
            <h2>Loading profile...</h2>
          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {

    return (
      <div className="tenant-page">

        <aside className="tenant-sidebar">

          <div className="tenant-brand">

            <img src={logo} alt="PGPeekIn" />

            <div>
              <h2>PGPeekIn</h2>
              <p>Tenant panel</p>
            </div>

          </div>

        </aside>

        <main className="tenant-main">

          <div style={{ padding: "40px" }}>

            <h2>Unable to load profile</h2>

            <p>{error}</p>

            <Link to="/login">
              Go to Login
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="tenant-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="tenant-sidebar">

        <div className="tenant-brand">

          <img src={logo} alt="PGPeekIn" />

          <div>

            <h2>PGPeekIn</h2>

            <p>Tenant panel</p>

          </div>

        </div>

        <nav className="tenant-menu">

          <Link to="/tenant-dashboard">

            <span>⌂</span>

            Dashboard

          </Link>

          <Link to="/tenant/search-pg">

            <span>⌕</span>

            Search PG

          </Link>

          <Link to="/tenant/bookings">

            <span>▣</span>

            My bookings

          </Link>

          <Link to="/tenant/reviews">

            <span>☆</span>

            My reviews

          </Link>

          <Link
            to="/tenant/profile"
            className="active"
          >

            <span>♙</span>

            My profile

          </Link>

        </nav>

        <Link
          to="/login"
          className="tenant-logout"
        >

          <span>⇥</span>

          Log out

        </Link>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="tenant-main">

        {/* ================= HEADER ================= */}

        <header className="tenant-header">

          <div>

            <h1>My Profile</h1>

            <p>
              View and manage your personal information.
            </p>

          </div>


          {/* ================= ACTUAL USER ================= */}

          <div className="tenant-user">

            <div className="tenant-avatar">

              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div>

              <strong>
                {profile.name || "User"}
              </strong>

              <span>
                {profile.role || "Tenant"}
              </span>

            </div>

          </div>

        </header>


        {/* ================= PROFILE CARD ================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-avatar">

              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div>

              <p className="booking-eyebrow">
                TENANT PROFILE
              </p>

              <h2>
                {profile.name || "User"}
              </h2>

              <span>
                {profile.role || "Tenant"} account
              </span>

            </div>

          </div>


          {/* ================= PROFILE DETAILS ================= */}

          <div className="profile-details">

            <div className="profile-field">

              <span>Full Name</span>

              <strong>
                {profile.name || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>Email</span>

              <strong>
                {profile.email || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>Phone</span>

              <strong>
                {profile.phone || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>Gender</span>

              <strong>
                {profile.gender || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>Occupation</span>

              <strong>
                {profile.occupation || "-"}
              </strong>

            </div>


            <div className="profile-field">

              <span>Role</span>

              <strong>
                {profile.role || "Tenant"}
              </strong>

            </div>

          </div>


          {/* ================= EDIT BUTTON ================= */}

          <div className="profile-actions">

            <button
              type="button"
              className="profile-edit-button"
              onClick={handleEdit}
            >

              Edit Profile

            </button>

          </div>

        </section>


        {/* ================= EDIT PROFILE POPUP ================= */}

        {showEdit && (

          <div className="profile-modal-overlay">

            <div className="profile-modal">

              {/* MODAL HEADER */}

              <div className="profile-modal-header">

                <div>

                  <p className="booking-eyebrow">
                    PROFILE SETTINGS
                  </p>

                  <h2>
                    Edit Profile
                  </h2>

                </div>


                <button
                  type="button"
                  className="profile-modal-close"
                  onClick={handleCancel}
                >

                  ×

                </button>

              </div>


              {/* FORM */}

              <form onSubmit={handleSave}>

                <div className="profile-form-grid">

                  {/* NAME */}

                  <div className="profile-form-field">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="profile-form-field">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />

                  </div>


                  {/* PHONE */}

                  <div className="profile-form-field">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* GENDER */}

                  <div className="profile-form-field">

                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >

                      <option value="Female">
                        Female
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>


                  {/* OCCUPATION */}

                  <div className="profile-form-field profile-form-full">

                    <label>
                      Occupation
                    </label>

                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                {/* BUTTONS */}

                <div className="profile-modal-actions">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    className="profile-save-button"
                  >

                    Save Changes

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

export default TenantProfile;