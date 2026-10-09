import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";

import "../../styles/auth/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      toast.success("Registration successful. Please login.");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* =========================================
                LEFT BRANDING SECTION
            ========================================= */}

      <div className="auth-brand">
        <div className="brand-content">
          {/* Logo */}

          <div className="brand-logo">
            <div className="brand-logo-icon">🏠</div>

            <span>
              Regal<span>Residences</span>
            </span>
          </div>

          {/* Main Message */}

          <div className="brand-message">
            <p className="brand-small-text">JOIN PROPERTYHUB</p>

            <h1>
              Your next
              <br />
              <span>chapter starts here.</span>
            </h1>

            <p className="brand-description">
              Create your account and become part of a simple and reliable
              property marketplace. Find properties, connect with people, and
              manage your real estate journey.
            </p>
          </div>

          {/* Features */}

          <div className="register-features">
            <div className="register-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Find Properties</strong>

                <span>Browse available properties</span>
              </div>
            </div>

            <div className="register-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Make Offers</strong>

                <span>Connect directly with sellers</span>
              </div>
            </div>

            <div className="register-feature">
              <div className="feature-icon">✓</div>

              <div>
                <strong>Manage Listings</strong>

                <span>Sell your properties easily</span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-overlay"></div>
      </div>

      {/* =========================================
                REGISTER FORM SECTION
            ========================================= */}

      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* Mobile Logo */}

          <div className="mobile-brand">
            <div className="brand-logo">
              <div className="brand-logo-icon">🏠</div>

              <span>
                Property<span>Hub</span>
              </span>
            </div>
          </div>

          {/* Heading */}

          <div className="auth-heading">
            <p className="auth-welcome">GET STARTED</p>

            <h2>Create your account</h2>

            <p>Join PropertyHub and start your journey.</p>
          </div>

          {/* Form */}

          <form className="auth-form register-form" onSubmit={handleSubmit}>
            {/* Name */}

            <div className="auth-input-group">
              <label htmlFor="name">Full name</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}

            <div className="auth-input-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              <span className="input-hint">
                Password must contain at least 6 characters.
              </span>
            </div>

            {/* Account Type */}

            <div className="auth-input-group">
              <label>Choose account type</label>

              <div className="role-selection">
                {/* Buyer */}

                <button
                  type="button"
                  className={`role-card ${
                    formData.role === "BUYER" ? "active" : ""
                  }`}
                  onClick={() => handleRoleChange("BUYER")}
                >
                  <div className="role-icon">🏡</div>

                  <div className="role-info">
                    <strong>Buyer</strong>

                    <span>Find and purchase properties</span>
                  </div>

                  <div className="role-check">
                    {formData.role === "BUYER" ? "✓" : ""}
                  </div>
                </button>

                {/* Seller */}

                <button
                  type="button"
                  className={`role-card ${
                    formData.role === "SELLER" ? "active" : ""
                  }`}
                  onClick={() => handleRoleChange("SELLER")}
                >
                  <div className="role-icon">🏢</div>

                  <div className="role-info">
                    <strong>Seller</strong>

                    <span>List and sell your properties</span>
                  </div>

                  <div className="role-check">
                    {formData.role === "SELLER" ? "✓" : ""}
                  </div>
                </button>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}

          <div className="auth-register">
            <span>Already have an account?</span>

            <Link to="/login">Sign in</Link>
          </div>

          {/* Footer */}

          <div className="auth-footer">
            <span>© 2026 PropertyHub</span>

            <span>Secure &amp; Reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
