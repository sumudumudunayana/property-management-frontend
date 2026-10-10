import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BuyerSidebar from "../../components/BuyerSidebar";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BuyerTopbar from "../../components/BuyerTopbar";
import "../../styles/buyer/BuyerOffers.css";

const BuyerOffers = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");

  // Counter response modal
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterActionLoading, setCounterActionLoading] = useState(false);

  // =========================================
  // LOAD MY OFFERS
  // =========================================

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/offers/my");

      setOffers(response.data || []);
    } catch (error) {
      console.error("Failed to load offers:", error);

      toast.error(
        error.response?.data?.message || "Failed to load your offers",
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
  // FORMAT PRICE
  // =========================================

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "—";
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // =========================================
  // FORMAT DATE
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================================
  // FORMAT STATUS
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

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";

      case "ACCEPTED":
        return "accepted";

      case "REJECTED":
        return "rejected";

      case "COUNTERED":
        return "countered";

      default:
        return "unknown";
    }
  };

  // =========================================
  // PROPERTY TYPE
  // =========================================

  const getPropertyTypeLabel = (type) => {
    if (!type) {
      return "Property";
    }

    return type
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================
  // OPEN COUNTER OFFER
  // =========================================

  const handleOpenCounterOffer = (offer) => {
    setSelectedOffer(offer);
    setShowCounterModal(true);
  };

  // =========================================
  // CLOSE COUNTER OFFER
  // =========================================

  const handleCloseCounterOffer = () => {
    if (counterActionLoading) {
      return;
    }

    setShowCounterModal(false);
    setSelectedOffer(null);
  };

  // =========================================
  // ACCEPT COUNTER OFFER
  // =========================================

  const handleAcceptCounter = async () => {
    if (!selectedOffer) {
      return;
    }

    try {
      setCounterActionLoading(true);

      await api.put(`/offers/${selectedOffer.id}/accept-counter`);

      toast.success("Counter offer accepted successfully");

      setShowCounterModal(false);
      setSelectedOffer(null);

      await loadOffers();
    } catch (error) {
      console.error("Failed to accept counter offer:", error);

      toast.error(
        error.response?.data?.message || "Failed to accept counter offer",
      );
    } finally {
      setCounterActionLoading(false);
    }
  };

  // =========================================
  // REJECT COUNTER OFFER
  // =========================================

  const handleRejectCounter = async () => {
    if (!selectedOffer) {
      return;
    }

    try {
      setCounterActionLoading(true);

      await api.put(`/offers/${selectedOffer.id}/reject-counter`);

      toast.success("Counter offer rejected");

      setShowCounterModal(false);
      setSelectedOffer(null);

      await loadOffers();
    } catch (error) {
      console.error("Failed to reject counter offer:", error);

      toast.error(
        error.response?.data?.message || "Failed to reject counter offer",
      );
    } finally {
      setCounterActionLoading(false);
    }
  };

  // =========================================
  // FILTER OFFERS
  // =========================================

  const filteredOffers = offers.filter((offer) => {
    if (statusFilter === "ALL") {
      return true;
    }

    return offer.status === statusFilter;
  });

  // =========================================
  // STATISTICS
  // =========================================

  const totalOffers = offers.length;

  const pendingOffers = offers.filter(
    (offer) => offer.status === "PENDING",
  ).length;

  const counteredOffers = offers.filter(
    (offer) => offer.status === "COUNTERED",
  ).length;

  const acceptedOffers = offers.filter(
    (offer) => offer.status === "ACCEPTED",
  ).length;

  return (
    <div className="buyer-offers-page">
      {/* =========================================
                SIDEBAR
            ========================================= */}

       <BuyerSidebar />

      {/* =========================================
                MAIN
            ========================================= */}

      <main className="buyer-offers-main">
        {/* Top Bar */}

        <BuyerTopbar title="My Offers" />
        {/* =========================================
                    INTRO
                ========================================= */}

        <section className="buyer-offers-intro">
          <div>
            <p>OFFER MANAGEMENT</p>

            <h1>
              Track your
              <span> property offers.</span>
            </h1>

            <span>
              View your submitted offers and respond to seller decisions.
            </span>
          </div>
        </section>

        {/* =========================================
                    STATISTICS
                ========================================= */}

        <section className="buyer-offers-stats">
          <div className="buyer-offers-stat-card">
            <div className="buyer-offers-stat-icon total">📄</div>

            <div>
              <span>Total Offers</span>

              <strong>{totalOffers}</strong>
            </div>
          </div>

          <div className="buyer-offers-stat-card">
            <div className="buyer-offers-stat-icon pending">⏱</div>

            <div>
              <span>Pending</span>

              <strong>{pendingOffers}</strong>
            </div>
          </div>

          <div className="buyer-offers-stat-card">
            <div className="buyer-offers-stat-icon counter">↔</div>

            <div>
              <span>Countered</span>

              <strong>{counteredOffers}</strong>
            </div>
          </div>

          <div className="buyer-offers-stat-card">
            <div className="buyer-offers-stat-icon accepted">✓</div>

            <div>
              <span>Accepted</span>

              <strong>{acceptedOffers}</strong>
            </div>
          </div>
        </section>

        {/* =========================================
                    OFFERS SECTION
                ========================================= */}

        <section className="buyer-offers-content">
          <div className="buyer-offers-section-header">
            <div>
              <p>YOUR OFFERS</p>

              <h3>Submitted Offers</h3>
            </div>

            <div className="buyer-offers-filter">
              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">All Offers</option>

                <option value="PENDING">Pending</option>

                <option value="COUNTERED">Countered</option>

                <option value="ACCEPTED">Accepted</option>

                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Loading */}

          {loading && (
            <div className="buyer-offers-loading">
              <div className="buyer-offers-spinner"></div>

              <p>Loading your offers...</p>
            </div>
          )}

          {/* Empty */}

          {!loading && filteredOffers.length === 0 && (
            <div className="buyer-offers-empty">
              <div className="buyer-offers-empty-icon">📄</div>

              <h4>
                {offers.length === 0 ? "No offers yet" : "No offers found"}
              </h4>

              <p>
                {offers.length === 0
                  ? "Your submitted property offers will appear here."
                  : "Try selecting a different status filter."}
              </p>

              {offers.length === 0 && (
                <button onClick={() => navigate("/buyer/properties")}>
                  Browse Properties
                </button>
              )}
            </div>
          )}

          {/* Offers */}

          {!loading && filteredOffers.length > 0 && (
            <div className="buyer-offers-list">
              {filteredOffers.map((offer) => {
                const property = offer.property;

                return (
                  <article className="buyer-offers-card" key={offer.id}>
                    {/* Property */}

                    <div className="buyer-offers-property">
                      <div className="buyer-offers-property-image">
                        {property?.imageUrl ? (
                          <img
                            src={property.imageUrl}
                            alt={property?.title || "Property"}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}

                        <div
                          className="buyer-offers-property-image-fallback"
                          style={{
                            display: property?.imageUrl ? "none" : "flex",
                          }}
                        >
                          🏠
                        </div>
                      </div>

                      <div className="buyer-offers-property-info">
                        <span>
                          {getPropertyTypeLabel(property?.propertyType)}
                        </span>

                        <h4>{property?.title || "Property"}</h4>

                        <p>📍 {property?.location || "Location unavailable"}</p>
                      </div>
                    </div>

                    {/* Offer */}

                    <div className="buyer-offers-details">
                      <div className="buyer-offers-detail">
                        <small>YOUR OFFER</small>

                        <strong>{formatPrice(offer.amount)}</strong>
                      </div>

                      <div className="buyer-offers-detail">
                        <small>LIST PRICE</small>

                        <strong>{formatPrice(property?.price)}</strong>
                      </div>

                      <div className="buyer-offers-detail">
                        <small>SUBMITTED</small>

                        <strong className="buyer-offers-date">
                          {formatDate(offer.createdAt)}
                        </strong>
                      </div>
                    </div>

                    {/* Status */}

                    <div className="buyer-offers-status-area">
                      <span
                        className={`buyer-offers-status ${getStatusClass(
                          offer.status,
                        )}`}
                      >
                        {getStatusLabel(offer.status)}
                      </span>
                    </div>

                    {/* Message */}

                    {offer.message && (
                      <div className="buyer-offers-message">
                        <small>YOUR MESSAGE</small>

                        <p>{offer.message}</p>
                      </div>
                    )}

                    {/* Counter Action */}

                    {offer.status === "COUNTERED" && (
                      <div className="buyer-offers-counter">
                        <div>
                          <strong>Seller sent a counter offer</strong>

                          <p>
                            Review the seller's counter offer and choose whether
                            to accept or reject it.
                          </p>
                        </div>

                        <button onClick={() => handleOpenCounterOffer(offer)}>
                          Review Counter
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}

        <footer className="buyer-offers-footer">
          <span>© 2026 PropertyHub</span>

          <span>Property Management Platform</span>
        </footer>
      </main>

      {/* =========================================
                COUNTER OFFER MODAL
            ========================================= */}

      {showCounterModal && selectedOffer && (
        <div
          className="buyer-counter-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseCounterOffer();
            }
          }}
        >
          <div className="buyer-counter-modal">
            {/* Header */}

            <div className="buyer-counter-modal-header">
              <div>
                <span>SELLER COUNTER OFFER</span>

                <h2>Review Counter Offer</h2>
              </div>

              <button
                type="button"
                className="buyer-counter-modal-close"
                onClick={handleCloseCounterOffer}
                disabled={counterActionLoading}
              >
                ×
              </button>
            </div>

            {/* Property */}

            <div className="buyer-counter-property">
              <div className="buyer-counter-property-icon">
                {selectedOffer.property?.imageUrl ? (
                  <img
                    src={selectedOffer.property.imageUrl}
                    alt={selectedOffer.property?.title || "Property"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="buyer-counter-property-icon-fallback"
                  style={{
                    display: selectedOffer.property?.imageUrl ? "none" : "flex",
                  }}
                >
                  🏠
                </div>
              </div>

              <div>
                <strong>{selectedOffer.property?.title || "Property"}</strong>

                <span>
                  📍{" "}
                  {selectedOffer.property?.location || "Location unavailable"}
                </span>
              </div>
            </div>

            {/* Amount Comparison */}

            <div className="buyer-counter-comparison">
              <div>
                <small>YOUR ORIGINAL OFFER</small>

                <strong>{formatPrice(selectedOffer.amount)}</strong>
              </div>

              <div className="buyer-counter-arrow">→</div>

              <div className="buyer-counter-new">
                <small>SELLER COUNTER OFFER</small>

                <strong>
                  {formatPrice(
                    selectedOffer.counterAmount ?? selectedOffer.amount,
                  )}
                </strong>
              </div>
            </div>

            {/* Counter Message */}

            <div className="buyer-counter-message">
              <small>SELLER MESSAGE</small>

              <p>
                {selectedOffer.counterMessage ||
                  "The seller has sent a counter offer. Review the offer and choose an action."}
              </p>
            </div>

            {/* Note */}

            <div className="buyer-counter-note">
              <span>ℹ</span>

              <p>
                Accepting this counter offer will mark your offer as accepted
                and place the property under offer.
              </p>
            </div>

            {/* Actions */}

            <div className="buyer-counter-actions">
              <button
                className="buyer-counter-reject"
                onClick={handleRejectCounter}
                disabled={counterActionLoading}
              >
                Reject Counter
              </button>

              <button
                className="buyer-counter-accept"
                onClick={handleAcceptCounter}
                disabled={counterActionLoading}
              >
                {counterActionLoading ? (
                  <>
                    <span className="buyer-counter-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Accept Counter
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOffers;
