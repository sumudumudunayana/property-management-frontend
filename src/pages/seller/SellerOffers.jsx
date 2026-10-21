import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SellerSidebar from "../../components/SellerSidebar";
import SellerTopbar from "../../components/SellerTopbar";

import api from "../../services/api";

import "../../styles/seller/SellerOffers.css";

const SellerOffers = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [counterOffer, setCounterOffer] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const loadOffers = async () => {
    try {
      setLoading(true);

      const propertiesResponse = await api.get("/properties/my");

      const properties = propertiesResponse.data || [];

      if (properties.length === 0) {
        setOffers([]);
        return;
      }

      const offerRequests = properties.map(async (property) => {
        try {
          const response = await api.get(`/offers/property/${property.id}`);

          return (response.data || []).map((offer) => ({
            ...offer,
            property,
          }));
        } catch (error) {
          console.error(
            `Failed to load offers for property ${property.id}`,
            error,
          );

          return [];
        }
      });

      const results = await Promise.all(offerRequests);

      const allOffers = results.flat();

      allOffers.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setOffers(allOffers);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleAccept = async (offerId) => {
    try {
      setActionLoading(offerId);

      await api.put(`/offers/${offerId}/accept`);

      toast.success("Offer accepted successfully");

      await loadOffers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId) => {
    try {
      setActionLoading(offerId);

      await api.put(`/offers/${offerId}/reject`);

      toast.success("Offer rejected");

      await loadOffers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(null);
    }
  };

  const openCounterModal = (offer) => {
    setCounterOffer(offer);

    setCounterAmount(offer.amount || "");

    setCounterMessage("");
  };

  const closeCounterModal = () => {
    setCounterOffer(null);

    setCounterAmount("");

    setCounterMessage("");
  };

  const handleCounter = async (e) => {
    e.preventDefault();

    if (!counterAmount || Number(counterAmount) <= 0) {
      toast.error("Counter amount must be greater than zero");

      return;
    }

    if (!counterMessage.trim()) {
      toast.error("Please enter a message");

      return;
    }

    try {
      setActionLoading(counterOffer.id);

      await api.put(`/offers/${counterOffer.id}/counter`, {
        amount: Number(counterAmount),
        message: counterMessage.trim(),
      });

      toast.success("Counter offer sent successfully");

      closeCounterModal();

      await loadOffers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send counter offer",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (amount) => {
    if (amount === null || amount === undefined) {
      return "Rs. 0";
    }

    return `Rs. ${Number(amount).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBuyerName = (offer) => {
    return offer.buyer?.name || offer.buyer?.email || "Buyer";
  };

  const getBuyerEmail = (offer) => {
    return offer.buyer?.email || "No email available";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "seller-offers-status-pending";

      case "COUNTERED":
        return "seller-offers-status-countered";

      case "ACCEPTED":
        return "seller-offers-status-accepted";

      case "REJECTED":
        return "seller-offers-status-rejected";

      default:
        return "";
    }
  };

  const canTakeAction = (status) => {
    return status === "PENDING" || status === "COUNTERED";
  };

  return (
    <div className="seller-offers-page">
      {/* SIDEBAR */}

      <SellerSidebar />

      {/* MAIN */}

      <main className="seller-offers-main">
        {/* REUSABLE TOPBAR */}

        <SellerTopbar title="Offers" />

        {/* CONTENT */}

        <div className="seller-offers-content">
          {/* INTRO */}

          <div className="seller-offers-intro">
            <div>
              <h2>Property Offers</h2>

              <p>Review and manage offers received from buyers.</p>
            </div>

            <div className="seller-offers-intro-actions">
              <div className="seller-offers-count">
                <span>{offers.length}</span>

                <small>Total Offers</small>
              </div>

              <button
                type="button"
                className="seller-offers-refresh-button"
                onClick={loadOffers}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="seller-offers-loading">
              <div className="seller-offers-loading-spinner"></div>

              <p>Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            /* EMPTY */

            <div className="seller-offers-empty">
              <div className="seller-offers-empty-icon">◫</div>

              <h3>No offers yet</h3>

              <p>
                When buyers make offers on your properties, they will appear
                here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/seller/properties")}
              >
                View My Properties
              </button>
            </div>
          ) : (
            /* OFFERS */

            <div className="seller-offers-list">
              {offers.map((offer) => (
                <article key={offer.id} className="seller-offers-card">
                  {/* CARD TOP */}

                  <div className="seller-offers-card-top">
                    <div className="seller-offers-property-info">
                      <span className="seller-offers-property-type">
                        {offer.property?.propertyType || "PROPERTY"}
                      </span>

                      <h3>{offer.property?.title || "Property"}</h3>

                      <p>
                        📍 {offer.property?.location || "Location unavailable"}
                      </p>
                    </div>

                    <div
                      className={`seller-offers-status ${getStatusClass(
                        offer.status,
                      )}`}
                    >
                      {offer.status}
                    </div>
                  </div>

                  {/* CARD BODY */}

                  <div className="seller-offers-card-body">
                    <div className="seller-offers-detail">
                      <span className="seller-offers-detail-label">BUYER</span>

                      <strong>{getBuyerName(offer)}</strong>

                      <small>{getBuyerEmail(offer)}</small>
                    </div>

                    <div className="seller-offers-detail">
                      <span className="seller-offers-detail-label">
                        OFFER AMOUNT
                      </span>

                      <strong className="seller-offers-amount">
                        {formatPrice(offer.amount)}
                      </strong>
                    </div>

                    <div className="seller-offers-detail">
                      <span className="seller-offers-detail-label">
                        RECEIVED
                      </span>

                      <strong>{formatDate(offer.createdAt)}</strong>
                    </div>
                  </div>

                  {/* MESSAGE */}

                  {offer.message && (
                    <div className="seller-offers-message">
                      <span>Buyer Message</span>

                      <p>"{offer.message}"</p>
                    </div>
                  )}

                  {/* ACTIONS */}

                  {canTakeAction(offer.status) && (
                    <div className="seller-offers-actions">
                      <button
                        type="button"
                        className="seller-offers-reject-button"
                        disabled={actionLoading === offer.id}
                        onClick={() => handleReject(offer.id)}
                      >
                        Reject
                      </button>

                      {offer.status === "PENDING" && (
                        <button
                          type="button"
                          className="seller-offers-counter-button"
                          disabled={actionLoading === offer.id}
                          onClick={() => openCounterModal(offer)}
                        >
                          Counter Offer
                        </button>
                      )}

                      <button
                        type="button"
                        className="seller-offers-accept-button"
                        disabled={actionLoading === offer.id}
                        onClick={() => handleAccept(offer.id)}
                      >
                        {actionLoading === offer.id
                          ? "Processing..."
                          : "Accept Offer"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* COUNTER MODAL */}

      {counterOffer && (
        <div
          className="seller-offers-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeCounterModal();
            }
          }}
        >
          <div className="seller-offers-modal">
            {/* MODAL HEADER */}

            <div className="seller-offers-modal-header">
              <div>
                <p>NEGOTIATION</p>

                <h2>Counter Offer</h2>
              </div>

              <button
                type="button"
                onClick={closeCounterModal}
                className="seller-offers-modal-close-button"
              >
                ×
              </button>
            </div>

            {/* PROPERTY */}

            <div className="seller-offers-modal-property">
              <strong>{counterOffer.property?.title || "Property"}</strong>

              <span>Current offer: {formatPrice(counterOffer.amount)}</span>
            </div>

            {/* FORM */}

            <form
              className="seller-offers-counter-form"
              onSubmit={handleCounter}
            >
              <div className="seller-offers-form-field">
                <label htmlFor="seller-counter-amount">Counter Amount</label>

                <div className="seller-offers-counter-price">
                  <span>Rs.</span>

                  <input
                    id="seller-counter-amount"
                    type="number"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="seller-offers-form-field">
                <label htmlFor="seller-counter-message">Message</label>

                <textarea
                  id="seller-counter-message"
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  rows="4"
                  placeholder="Write a message to the buyer..."
                />
              </div>

              <div className="seller-offers-modal-actions">
                <button
                  type="button"
                  className="seller-offers-modal-cancel-button"
                  onClick={closeCounterModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="seller-offers-modal-submit-button"
                  disabled={actionLoading === counterOffer.id}
                >
                  {actionLoading === counterOffer.id
                    ? "Sending..."
                    : "Send Counter Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOffers;
