import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/pgpeekin-logo.png";
import "../../styles/Register.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[0-9]{10}$/;


function Register() {

  const navigate = useNavigate();


  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "tenant",
    occupation: "",
    password: "",
    confirmPassword: "",

  });


  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


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


    // NAME

    if (!formData.name.trim()) {

      newErrors.name =
        "Full name is required";

    }


    // EMAIL

    const email =
      formData.email.trim();

    if (!email) {

      newErrors.email =
        "Email address is required";

    } else if (
      !EMAIL_REGEX.test(email)
    ) {

      newErrors.email =
        "Enter a valid email address";

    }


    // PHONE

    const phone =
      formData.phone.trim();

    if (!phone) {

      newErrors.phone =
        "Phone number is required";

    } else if (
      !PHONE_REGEX.test(phone)
    ) {

      newErrors.phone =
        "Enter a valid 10-digit phone number";

    }


    // GENDER

    if (!formData.gender.trim()) {

      newErrors.gender =
        "Gender is required";

    }


    // ROLE

    if (!formData.role.trim()) {

      newErrors.role =
        "Please select your role";

    }


    // PASSWORD

    if (!formData.password) {

      newErrors.password =
        "Password is required";

    } else if (
      formData.password.length < 6
    ) {

      newErrors.password =
        "Password must contain at least 6 characters";

    }


    // CONFIRM PASSWORD

    if (!formData.confirmPassword) {

      newErrors.confirmPassword =
        "Please confirm your password";

    } else if (
      formData.password !==
      formData.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match";

    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  };


  // =========================================================
  // REGISTER
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!validate()) {
      return;
    }


    setIsSubmitting(true);


    try {

      const response = await fetch(
        `${API_BASE_URL}/PgPeekIn/users/register`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            name: formData.name.trim(),

            email: formData.email.trim(),

            phone: formData.phone.trim(),

            gender: formData.gender.trim(),

            role: formData.role.trim().toLowerCase(),

            occupation:
              formData.occupation.trim(),

            user_password:
              formData.password,

          }),

        }
      );


      // =====================================================
      // READ RESPONSE
      // =====================================================

      const responseText =
        await response.text();


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
      // ERROR
      // =====================================================

      if (!response.ok) {

        throw new Error(

          data.message ||
          responseText ||
          `Registration failed (${response.status})`

        );

      }


      // =====================================================
      // SUCCESS
      // =====================================================

      alert(
        "Registration successful! Please login."
      );


      navigate("/login");


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      alert(
        error.message ||
        "Unable to register"
      );


    } finally {

      setIsSubmitting(false);

    }

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="register-page">

      <div className="register-container">


        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="register-left">

          <div className="register-brand-content">

            <img
              src={logo}
              alt="PGPeekIn"
              className="register-brand-logo"
            />

            <h1>
              PGPeekIn
            </h1>

            <h2>
              Find Your Perfect Stay
            </h2>

            <p className="register-brand-tagline">
              Search <span>•</span> Compare{" "}
              <span>•</span> Move In
            </p>

            <p className="register-brand-description">

              Join PGPeekIn and discover PG
              accommodations based on your
              location, preferences, facilities,
              room type, and availability.

            </p>


            <div className="register-feature-list">

              <div className="register-feature-item">

                <span className="register-check-icon">
                  ✓
                </span>

                <p>
                  Search PGs easily
                </p>

              </div>


              <div className="register-feature-item">

                <span className="register-check-icon">
                  ✓
                </span>

                <p>
                  Compare rooms and facilities
                </p>

              </div>


              <div className="register-feature-item">

                <span className="register-check-icon">
                  ✓
                </span>

                <p>
                  Check real-time availability
                </p>

              </div>


              <div className="register-feature-item">

                <span className="register-check-icon">
                  ✓
                </span>

                <p>
                  Book your stay with confidence
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="register-right">

          <div className="register-form-container">


  


      


            <div className="register-form-header">

              <h1>
                Create Account
              </h1>

              <p>
                Join PGPeekIn and find your perfect stay
              </p>

            </div>


            <form
              className="register-form"
              onSubmit={handleSubmit}
              noValidate
            >


              {/* =============================================
                  NAME
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={
                    errors.name
                      ? "register-input input-error"
                      : "register-input"
                  }
                />

                {errors.name && (
                  <p className="register-field-error">
                    {errors.name}
                  </p>
                )}

              </div>


              {/* =============================================
                  EMAIL
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={
                    errors.email
                      ? "register-input input-error"
                      : "register-input"
                  }
                />

                {errors.email && (
                  <p className="register-field-error">
                    {errors.email}
                  </p>
                )}

              </div>


              {/* =============================================
                  PHONE
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={
                    errors.phone
                      ? "register-input input-error"
                      : "register-input"
                  }
                />

                {errors.phone && (
                  <p className="register-field-error">
                    {errors.phone}
                  </p>
                )}

              </div>


              {/* =============================================
                  GENDER
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={
                    errors.gender
                      ? "register-input input-error"
                      : "register-input"
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>


                {errors.gender && (
                  <p className="register-field-error">
                    {errors.gender}
                  </p>
                )}

              </div>


              {/* =============================================
                  ROLE
              ============================================== */}

              <div className="register-form-field">

                <label>
                  Register As
                </label>


                <div className="role-selection">

                  <label className="role-option">

                    <input
                      type="radio"
                      name="role"
                      value="tenant"
                      checked={
                        formData.role === "tenant"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Tenant
                    </span>

                  </label>


                  <label className="role-option">

                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={
                        formData.role === "owner"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      PG Owner
                    </span>

                  </label>

                </div>

              </div>


              {/* =============================================
                  OCCUPATION
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="occupation">
                  Occupation
                </label>

                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  placeholder="Enter your occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="register-input"
                />

              </div>


              {/* =============================================
                  PASSWORD
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="password">
                  Password
                </label>


                <div className="register-password-wrapper">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      errors.password
                        ? "register-input input-error"
                        : "register-input"
                    }
                  />


                  <button
                    type="button"
                    className="register-password-toggle"
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
                  <p className="register-field-error">
                    {errors.password}
                  </p>
                )}

              </div>


              {/* =============================================
                  CONFIRM PASSWORD
              ============================================== */}

              <div className="register-form-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>


                <div className="register-password-wrapper">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={
                      errors.confirmPassword
                        ? "register-input input-error"
                        : "register-input"
                    }
                  />


                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >

                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}

                  </button>

                </div>


                {errors.confirmPassword && (
                  <p className="register-field-error">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>


              {/* =============================================
                  SUBMIT
              ============================================== */}

              <button
                type="submit"
                className="register-submit-btn"
                disabled={isSubmitting}
              >

                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}

              </button>

            </form>


            {/* =============================================
                LOGIN LINK
            ============================================== */}

            <p className="register-login-prompt">

              Already have an account?

              <Link to="/login">
                Sign In
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Register;