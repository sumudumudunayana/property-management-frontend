import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

import "../styles/components/BuyerSidebar.css";

const BuyerSidebar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================
  // ACTIVE PAGE
  // =========================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================================
  // PROFILE
  // =========================================

  const handleProfile = () => {
    toast.info("Profile feature coming soon");
  };

  return (
    <aside className="regal-buyer-sidebar">

      {/* =========================================
          LOGO
      ========================================= */}

      <div className="regal-buyer-sidebar-logo">

        <div className="regal-buyer-sidebar-logo-icon">
          <span>R</span>
        </div>

        <div className="regal-buyer-sidebar-brand">
          <span className="regal-buyer-brand-main">
            Regal
          </span>

          <span className="regal-buyer-brand-sub">
            Residences
          </span>
        </div>

      </div>

      {/* =========================================
          NAVIGATION
      ========================================= */}

      <nav className="regal-buyer-sidebar-nav">

        <p className="regal-buyer-sidebar-section-title">
          MAIN MENU
        </p>

        {/* Dashboard */}

        <button
          type="button"
          className={`regal-buyer-sidebar-nav-item ${
            isActive("/buyer") ? "active" : ""
          }`}
          onClick={() => navigate("/buyer")}
        >
          <span className="regal-buyer-sidebar-nav-icon">
            <span>⌂</span>
          </span>

          <span className="regal-buyer-sidebar-nav-label">
            Dashboard
          </span>
        </button>

        {/* Browse Properties */}

        <button
          type="button"
          className={`regal-buyer-sidebar-nav-item ${
            isActive("/buyer/properties") ? "active" : ""
          }`}
          onClick={() => navigate("/buyer/properties")}
        >
          <span className="regal-buyer-sidebar-nav-icon">
            <span>▱</span>
          </span>

          <span className="regal-buyer-sidebar-nav-label">
            Browse Properties
          </span>
        </button>

        {/* My Offers */}

        <button
          type="button"
          className={`regal-buyer-sidebar-nav-item ${
            isActive("/buyer/offers") ? "active" : ""
          }`}
          onClick={() => navigate("/buyer/offers")}
        >
          <span className="regal-buyer-sidebar-nav-icon">
            <span>◇</span>
          </span>

          <span className="regal-buyer-sidebar-nav-label">
            My Offers
          </span>
        </button>

        {/* =========================================
            ACCOUNT
        ========================================= */}

        <p className="regal-buyer-sidebar-section-title regal-buyer-sidebar-account-title">
          ACCOUNT
        </p>

        {/* Profile */}

        <button
          type="button"
          className="regal-buyer-sidebar-nav-item"
          onClick={handleProfile}
        >
          <span className="regal-buyer-sidebar-nav-icon">
            <span>○</span>
          </span>

          <span className="regal-buyer-sidebar-nav-label">
            Profile
          </span>
        </button>

      </nav>

      {/* =========================================
          SIDEBAR BOTTOM
      ========================================= */}

      <div className="regal-buyer-sidebar-bottom">

        {/* User */}

        <div className="regal-buyer-sidebar-user">

          <div className="regal-buyer-sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "B"}
          </div>

          <div className="regal-buyer-sidebar-user-info">

            <strong>
              {user?.name || "Buyer"}
            </strong>

            <span>
              Property Buyer
            </span>

          </div>

        </div>

        {/* Logout */}

        <button
          type="button"
          className="regal-buyer-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="regal-buyer-sidebar-logout-icon">
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
};

export default BuyerSidebar;