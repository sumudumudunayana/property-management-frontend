import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

import "../styles/components/SellerSidebar.css";

const SellerSidebar = () => {
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
    <aside className="regal-seller-sidebar">

      {/* =========================================
          LOGO
      ========================================= */}

      <div className="regal-seller-sidebar-logo">

        <div className="regal-seller-sidebar-logo-icon">
          <span>R</span>
        </div>

        <div className="regal-seller-sidebar-brand">
          <span className="regal-brand-main">
            Regal
          </span>

          <span className="regal-brand-sub">
            Residences
          </span>
        </div>

      </div>

      {/* =========================================
          NAVIGATION
      ========================================= */}

      <nav className="regal-seller-sidebar-nav">

        <p className="regal-seller-sidebar-section-title">
          MAIN MENU
        </p>

        {/* Dashboard */}

        <button
          type="button"
          className={`regal-seller-sidebar-nav-item ${
            isActive("/seller") ? "active" : ""
          }`}
          onClick={() => navigate("/seller")}
        >
          <span className="regal-seller-sidebar-nav-icon">
            <span>⌂</span>
          </span>

          <span className="regal-seller-sidebar-nav-label">
            Dashboard
          </span>
        </button>

        {/* My Properties */}

        <button
          type="button"
          className={`regal-seller-sidebar-nav-item ${
            isActive("/seller/properties") ? "active" : ""
          }`}
          onClick={() => navigate("/seller/properties")}
        >
          <span className="regal-seller-sidebar-nav-icon">
            <span>▱</span>
          </span>

          <span className="regal-seller-sidebar-nav-label">
            My Properties
          </span>
        </button>

        {/* Add Property */}

        <button
          type="button"
          className={`regal-seller-sidebar-nav-item ${
            isActive("/seller/properties/create") ? "active" : ""
          }`}
          onClick={() => navigate("/seller/properties/create")}
        >
          <span className="regal-seller-sidebar-nav-icon">
            <span>＋</span>
          </span>

          <span className="regal-seller-sidebar-nav-label">
            Add Property
          </span>
        </button>

        {/* Offers */}

        <button
          type="button"
          className={`regal-seller-sidebar-nav-item ${
            location.pathname === "/seller/offers" ||
            location.pathname.includes("/offers")
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/seller/offers")}
        >
          <span className="regal-seller-sidebar-nav-icon">
            <span>◇</span>
          </span>

          <span className="regal-seller-sidebar-nav-label">
            Offers
          </span>
        </button>

        {/* =========================================
            ACCOUNT
        ========================================= */}

        <p className="regal-seller-sidebar-section-title regal-seller-sidebar-account-title">
          ACCOUNT
        </p>

        {/* Profile */}

        <button
          type="button"
          className="regal-seller-sidebar-nav-item"
          onClick={handleProfile}
        >
          <span className="regal-seller-sidebar-nav-icon">
            <span>○</span>
          </span>

          <span className="regal-seller-sidebar-nav-label">
            Profile
          </span>
        </button>

      </nav>

      {/* =========================================
          SIDEBAR BOTTOM
      ========================================= */}

      <div className="regal-seller-sidebar-bottom">

        {/* User */}

        <div className="regal-seller-sidebar-user">

          <div className="regal-seller-sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="regal-seller-sidebar-user-info">

            <strong>
              {user?.name || "Seller"}
            </strong>

            <span>
              Property Seller
            </span>

          </div>

        </div>

        {/* Logout */}

        <button
          type="button"
          className="regal-seller-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="regal-seller-sidebar-logout-icon">
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

export default SellerSidebar;