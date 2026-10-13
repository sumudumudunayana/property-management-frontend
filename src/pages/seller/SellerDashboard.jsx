import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import SellerTopbar from "../../components/SellerTopbar";
import api from "../../services/api";
import SellerSidebar from "../../components/SellerSidebar";
import "../../styles/seller/SellerDashboard.css";

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =========================================
  // DASHBOARD DATA
  // =========================================

  const [properties, setProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Get seller's properties
        const propertiesResponse = await api.get("/properties/my");

        const sellerProperties = propertiesResponse.data || [];

        setProperties(sellerProperties);

        // Get offers for all seller properties
        const offerRequests = sellerProperties.map((property) =>
          api.get(`/offers/property/${property.id}`),
        );

        const offerResponses = await Promise.all(offerRequests);

        const allOffers = offerResponses.flatMap(
          (response) => response.data || [],
        );

        setOffers(allOffers);
      } catch (error) {
        console.error("Failed to load seller dashboard data:", error);

        toast.error(
          error.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // =========================================
  // CALCULATE STATISTICS
  // =========================================

  const totalProperties = properties.length;

  const availableProperties = properties.filter(
    (property) => property.status === "AVAILABLE",
  ).length;

  const totalOffers = offers.length;

  const pendingOffers = offers.filter(
    (offer) => offer.status === "PENDING",
  ).length;

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <div className="seller-dashboard">
      {/* =========================================
                SIDEBAR
            ========================================= */}

      <SellerSidebar />

      {/* =========================================
                MAIN CONTENT
            ========================================= */}

      <main className="seller-main">
        {/* Top Bar */}

       <SellerTopbar title="Dashboard" />

        {/* =========================================
                    WELCOME BANNER
                ========================================= */}

        <section className="seller-welcome-banner">
          <div className="seller-welcome-content">
            <p>WELCOME BACK</p>

            <h1>
              Manage your
              <br />
              <span>property portfolio.</span>
            </h1>

            <p className="seller-welcome-description">
              Manage your property listings, review buyer offers, and keep track
              of your selling activity from one place.
            </p>

            <button
              className="seller-primary-btn"
              onClick={() => navigate("/seller/properties/create")}
            >
              Add New Property
              <span>＋</span>
            </button>
          </div>

          {/* Banner Decoration */}

          <div className="seller-welcome-decoration">
            <div className="seller-decoration-circle seller-circle-one"></div>

            <div className="seller-decoration-circle seller-circle-two"></div>

            <div className="seller-house-decoration">🏢</div>
          </div>
        </section>

        {/* =========================================
                    STATISTICS
                ========================================= */}

        <section className="seller-dashboard-stats">
          {/* Total Properties */}

          <div className="seller-stat-card">
            <div className="seller-stat-icon property-stat">🏠</div>

            <div className="seller-stat-info">
              <span>My Properties</span>

              <strong>{loading ? "..." : totalProperties}</strong>

              <small>Total listings</small>
            </div>
          </div>

          {/* Available */}

          <div className="seller-stat-card">
            <div className="seller-stat-icon available-stat">✓</div>

            <div className="seller-stat-info">
              <span>Available</span>

              <strong>{loading ? "..." : availableProperties}</strong>

              <small>Active listings</small>
            </div>
          </div>

          {/* Offers */}

          <div className="seller-stat-card">
            <div className="seller-stat-icon offer-stat">📄</div>

            <div className="seller-stat-info">
              <span>Offers Received</span>

              <strong>{loading ? "..." : totalOffers}</strong>

              <small>Buyer offers</small>
            </div>
          </div>

          {/* Pending */}

          <div className="seller-stat-card">
            <div className="seller-stat-icon pending-stat">⏱</div>

            <div className="seller-stat-info">
              <span>Pending Offers</span>

              <strong>{loading ? "..." : pendingOffers}</strong>

              <small>Awaiting response</small>
            </div>
          </div>
        </section>

        {/* =========================================
                    QUICK ACTIONS
                ========================================= */}

        <section className="seller-dashboard-section">
          <div className="seller-section-heading">
            <div>
              <p>QUICK ACTIONS</p>

              <h3>Manage your properties</h3>
            </div>
          </div>

          <div className="seller-quick-actions">
            {/* My Properties */}

            <div
              className="seller-action-card"
              onClick={() => navigate("/seller/properties")}
            >
              <div className="seller-action-icon properties-icon">🏠</div>

              <div className="seller-action-content">
                <h4>My Properties</h4>

                <p>View, edit, and manage all your property listings.</p>

                <span>Manage properties →</span>
              </div>
            </div>

            {/* Add Property */}

            <div
              className="seller-action-card"
              onClick={() => navigate("/seller/properties/create")}
            >
              <div className="seller-action-icon add-property-icon">＋</div>

              <div className="seller-action-content">
                <h4>Add Property</h4>

                <p>
                  Create a new property listing and make it available to buyers.
                </p>

                <span>Create listing →</span>
              </div>
            </div>

            {/* Offers */}

            <div
              className="seller-action-card"
              onClick={() => navigate("/seller/offers")}
            >
              <div className="seller-action-icon seller-offers-icon">📋</div>

              <div className="seller-action-content">
                <h4>Manage Offers</h4>

                <p>
                  Review buyer offers and negotiate directly with potential
                  buyers.
                </p>

                <span>View offers →</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
                    SELLING GUIDE
                ========================================= */}

        <section className="seller-dashboard-section">
          <div className="seller-section-heading">
            <div>
              <p>SELLER GUIDE</p>

              <h3>Manage your listings</h3>
            </div>
          </div>

          <div className="seller-guide">
            <div className="seller-guide-step">
              <div className="seller-guide-number">01</div>

              <div>
                <h4>Create a listing</h4>

                <p>
                  Add your property details, price, location and property type.
                </p>
              </div>
            </div>

            <div className="seller-guide-line"></div>

            <div className="seller-guide-step">
              <div className="seller-guide-number">02</div>

              <div>
                <h4>Receive offers</h4>

                <p>Buyers can submit offers directly on your properties.</p>
              </div>
            </div>

            <div className="seller-guide-line"></div>

            <div className="seller-guide-step">
              <div className="seller-guide-number">03</div>

              <div>
                <h4>Negotiate &amp; accept</h4>

                <p>Review offers, counter them, or accept the right offer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}

        <footer className="seller-dashboard-footer">
          <span>© 2026 PropertyHub</span>

          <span>Property Management Platform</span>
        </footer>
      </main>
    </div>
  );
};

export default SellerDashboard;
