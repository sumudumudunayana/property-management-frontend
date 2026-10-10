import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BuyerSidebar from "../../components/BuyerSidebar";
import "../../styles/buyer/BuyerDashboard.css";
import BuyerTopbar from "../../components/BuyerTopbar";

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [availableProperties, setAvailableProperties] = useState(0);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [propertiesResponse, offersResponse] = await Promise.all([
        api.get("/properties"),
        api.get("/offers/my"),
      ]);

      setAvailableProperties(propertiesResponse.data?.length || 0);

      setMyOffers(offersResponse.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);

      toast.error(
        error.response?.data?.message || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
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
  // STATISTICS
  // =========================================

  const totalOffers = myOffers.length;

  const pendingOffers = myOffers.filter(
    (offer) => offer.status === "PENDING",
  ).length;

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================================
  // STATUS LABEL
  // =========================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "ACCEPTED":
        return "Accepted";

      case "REJECTED":
        return "Rejected";

      case "COUNTERED":
        return "Counter Offer";

      default:
        return status || "Unknown";
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "activity-status-pending";

      case "ACCEPTED":
        return "activity-status-accepted";

      case "REJECTED":
        return "activity-status-rejected";

      case "COUNTERED":
        return "activity-status-countered";

      default:
        return "activity-status-default";
    }
  };

  // =========================================
  // RECENT OFFERS
  // =========================================

  const recentOffers = [...myOffers]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();

      const dateB = new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div className="buyer-dashboard">
      {/* =========================================
                SIDEBAR
            ========================================= */}

       <BuyerSidebar />

      {/* =========================================
                MAIN CONTENT
            ========================================= */}

      <main className="buyer-main">
        {/* Top Bar */}

        <BuyerTopbar title="Dashboard" />

        {/* =========================================
                    WELCOME BANNER
                ========================================= */}

        <section className="welcome-banner">
          <div className="welcome-content">
            <p>WELCOME BACK</p>

            <h1>
              Find your next
              <br />
              <span>perfect property.</span>
            </h1>

            <p className="welcome-description">
              Explore available properties and find a place that matches what
              you're looking for.
            </p>

            <button
              className="primary-dashboard-btn"
              onClick={() => navigate("/buyer/properties")}
            >
              Browse Properties
              <span>→</span>
            </button>
          </div>

          <div className="welcome-decoration">
            <div className="decoration-circle circle-one"></div>

            <div className="decoration-circle circle-two"></div>

            <div className="house-decoration">🏡</div>
          </div>
        </section>

        {/* =========================================
                    REAL STATISTICS
                ========================================= */}

        <section className="dashboard-stats">
          {/* Available Properties */}

          <div className="stat-card">
            <div className="stat-icon property-stat">🏠</div>

            <div className="stat-info">
              <span>Available Properties</span>

              <strong>{loading ? "..." : availableProperties}</strong>

              <small>Explore properties</small>
            </div>
          </div>

          {/* My Offers */}

          <div className="stat-card">
            <div className="stat-icon offer-stat">📄</div>

            <div className="stat-info">
              <span>My Offers</span>

              <strong>{loading ? "..." : totalOffers}</strong>

              <small>Submitted offers</small>
            </div>
          </div>

          {/* Pending Offers */}

          <div className="stat-card">
            <div className="stat-icon pending-stat">⏱</div>

            <div className="stat-info">
              <span>Pending Offers</span>

              <strong>{loading ? "..." : pendingOffers}</strong>

              <small>Awaiting response</small>
            </div>
          </div>
        </section>

        {/* =========================================
                    QUICK ACTIONS
                ========================================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p>QUICK ACTIONS</p>

              <h3>What would you like to do?</h3>
            </div>
          </div>

          <div className="quick-actions">
            <div
              className="action-card"
              onClick={() => navigate("/buyer/properties")}
            >
              <div className="action-icon browse-icon">🔎</div>

              <div className="action-content">
                <h4>Browse Properties</h4>

                <p>
                  Discover houses, apartments, land and commercial properties.
                </p>

                <span>Explore now →</span>
              </div>
            </div>

            <div
              className="action-card"
              onClick={() => navigate("/buyer/offers")}
            >
              <div className="action-icon offers-icon">📋</div>

              <div className="action-content">
                <h4>Manage My Offers</h4>

                <p>Track your offers and respond to seller counter offers.</p>

                <span>View offers →</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
                    RECENT ACTIVITY
                ========================================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p>ACTIVITY</p>

              <h3>Recent Activity</h3>
            </div>

            <button
              className="section-link"
              onClick={() => navigate("/buyer/offers")}
            >
              View all
            </button>
          </div>

          {/* No offers */}

          {!loading && recentOffers.length === 0 && (
            <div className="empty-activity">
              <div className="empty-activity-icon">📋</div>

              <h4>No recent activity</h4>

              <p>Your property offers and activity will appear here.</p>

              <button onClick={() => navigate("/buyer/properties")}>
                Start Exploring
              </button>
            </div>
          )}

          {/* Recent offers */}

          {!loading && recentOffers.length > 0 && (
            <div className="buyer-dashboard-activity-list">
              {recentOffers.map((offer) => (
                <div className="buyer-dashboard-activity-card" key={offer.id}>
                  <div className="buyer-dashboard-activity-icon">
                    {offer.property?.imageUrl ? (
                      <img
                        src={offer.property.imageUrl}
                        alt={offer.property?.title || "Property"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="buyer-dashboard-activity-image-fallback"
                      style={{
                        display: offer.property?.imageUrl ? "none" : "flex",
                      }}
                    >
                      📄
                    </div>
                  </div>

                  <div className="buyer-dashboard-activity-info">
                    <strong>{offer.property?.title || "Property Offer"}</strong>

                    <span>
                      Offer submitted on {formatDate(offer.createdAt)}
                    </span>
                  </div>

                  <div className="buyer-dashboard-activity-status">
                    <span className={getStatusClass(offer.status)}>
                      {getStatusLabel(offer.status)}
                    </span>
                  </div>

                  <button
                    className="buyer-dashboard-activity-view"
                    onClick={() => navigate("/buyer/offers")}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading activity */}

          {loading && (
            <div className="empty-activity">
              <div className="buyer-dashboard-loading-spinner"></div>

              <h4>Loading activity...</h4>

              <p>Fetching your latest offers.</p>
            </div>
          )}
        </section>

        {/* Footer */}

        <footer className="dashboard-footer">
          <span>© 2026 PropertyHub</span>

          <span>Property Management Platform</span>
        </footer>
      </main>
    </div>
  );
};

export default BuyerDashboard;
