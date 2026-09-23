import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/pgpeekin-logo.png";
import "../../styles/Login.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const newErrors = {};

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/PgPeekIn/users/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim(),
            user_password: formData.password,
          }),
        }
      );


      // =====================================================
      // READ RESPONSE
      // =====================================================

      const responseText = await response.text();

      let data;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message: responseText,
        };
      }


      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
          responseText ||
          `Login failed (${response.status})`
        );
      }


      // =====================================================
      // CHECK TOKEN
      // =====================================================

      if (!data.token) {
        throw new Error(
          "Login successful, but JWT token was not received."
        );
      }


      // =====================================================
      // GET ROLE
      // =====================================================

      const rawRole =
        data.role ||
        data.userRole ||
        data.user_role ||
        (data.user &&
          (
            data.user.role ||
            data.user.userRole ||
            data.user.user_role
          )) ||
        "";

      const userRole = String(rawRole)
        .trim()
        .toLowerCase();


      if (!userRole) {
        throw new Error(
          "Login successful, but user role was not received."
        );
      }


      // =====================================================
      // SAVE LOGIN DATA
      // =====================================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );


      // =====================================================
      // REMEMBER EMAIL
      // =====================================================

      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          formData.email.trim()
        );
      } else {
        localStorage.removeItem(
          "rememberedEmail"
        );
      }


      // =====================================================
      // ROLE BASED NAVIGATION
      // =====================================================

      if (userRole === "owner") {
        navigate("/owner-dashboard");

      } else if (userRole === "tenant") {
        navigate("/tenant-dashboard");

      } else {
        throw new Error(
          `Invalid user role: ${userRole}`
        );
      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        error.message ||
        "Unable to login"
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="login-page">

      <div className="login-container">

        {/* ===================================================
            LEFT SIDE - BRANDING
        =================================================== */}

        <div className="login-left">

          <div className="brand-content">

      
            <img
              src={logo}
              alt="PGPeekIn"
            />
      

            <h1>
              PGPeekIn
            </h1>

            <h2>
              Find Your Perfect Stay
            </h2>

            <p className="brand-tagline">
              Search <span>•</span> Compare{" "}
              <span>•</span> Move In
            </p>

            <p className="brand-description">
              Find the best PG based on location,
              facilities, room type and availability.
            </p>

            <div className="feature-list">

              <div className="feature-item">

                <span className="check-icon">
                  ✓
                </span>

                <p>
                  Find PGs easily
                </p>

              </div>


              <div className="feature-item">

                <span className="check-icon">
                  ✓
                </span>

                <p>
                  Compare rooms
                </p>

              </div>


              <div className="feature-item">

                <span className="check-icon">
                  ✓
                </span>

                <p>
                  Check availability
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT SIDE - LOGIN
        =================================================== */}

        <div className="login-right">

          <div className="login-form-container">

            <div className="mobile-logo">

              <img
                src={logo}
                alt="PGPeekIn"
              />

            </div>


            <div className="login-form-header">

              <h1>
                Welcome Back
              </h1>

              <p className="login-subtitle">
                Sign in to continue to PGPeekIn
              </p>

            </div>


            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* =============================================
                  EMAIL
              ============================================== */}

              <div className="form-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div
                  className={`input-shell ${
                    errors.email
                      ? "input-error"
                      : ""
                  }`}
                >

                  <span className="input-icon">

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                    >

                      <path
                        d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                      <path
                        d="m3 5.5 7 5 7-5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </span>


                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>


                {errors.email && (
                  <p className="field-error">
                    {errors.email}
                  </p>
                )}

              </div>


              {/* =============================================
                  PASSWORD
              ============================================== */}

              <div className="form-field">

                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`input-shell ${
                    errors.password
                      ? "input-error"
                      : ""
                  }`}
                >

                  <span className="input-icon">

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                    >

                      <rect
                        x="4"
                        y="8.5"
                        width="12"
                        height="8"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                      <path
                        d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                    </svg>

                  </span>


                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />


                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>


                {errors.password && (
                  <p className="field-error">
                    {errors.password}
                  </p>
                )}

              </div>


              {/* =============================================
                  REMEMBER ME
              ============================================== */}

              <div className="form-row">

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Remember me
                  </span>

                </label>


                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot password?
                </Link>

              </div>


              {/* =============================================
                  SIGN IN
              ============================================== */}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >

                {isSubmitting
                  ? "Signing in..."
                  : "Sign In"}

              </button>

            </form>


            {/* =============================================
                REGISTER
            ============================================== */}

            <p className="register-prompt">

              Don't have an account?

              <Link to="/register">
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;