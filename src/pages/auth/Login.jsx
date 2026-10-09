import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import "../../styles/auth/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      login(response.data);

      toast.success("Login successful");

      if (response.data.role === "SELLER") {
        navigate("/seller");
      } else {
        navigate("/buyer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Branding Section */}
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-icon">🏠</div>

            <span>
              Regal<span>Residences</span>
            </span>
          </div>

          <div className="brand-message">
            <p className="brand-small-text">PROPERTY MANAGEMENT</p>

            <h1>
              Find a place
              <br />
              <span>you can call home.</span>
            </h1>

            <p className="brand-description">
              Discover properties, connect with buyers and sellers, and manage
              your real estate journey from one simple platform.
            </p>
          </div>

          <div className="brand-stats">
            <div>
              <strong>500+</strong>
              <span>Properties</span>
            </div>

            <div>
              <strong>200+</strong>
              <span>Users</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Locations</span>
            </div>
          </div>
        </div>

        <div className="brand-overlay"></div>
      </div>

      {/* Login Section */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="mobile-brand">
            <div className="brand-logo">
              <div className="brand-logo-icon">🏠</div>

              <span>
                Property<span>Hub</span>
              </span>
            </div>
          </div>

          <div className="auth-heading">
            <p className="auth-welcome">WELCOME BACK</p>

            <h2>Sign in to your account</h2>

            <p>Enter your details below to continue.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="auth-register">
            <span>Don't have an account?</span>

            <Link to="/register">Create an account</Link>
          </div>

          <div className="auth-footer">
            <span>© 2026 PropertyHub</span>
            <span>Secure &amp; Reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
