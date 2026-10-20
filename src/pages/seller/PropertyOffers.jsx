import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SellerTopbar from "../../components/SellerTopbar";
import api from "../../services/api";
import SellerSidebar from "../../components/SellerSidebar";
import "../../styles/seller/PropertyOffers.css";

const PropertyOffers = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [property, setProperty] = useState(null);
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [counterData, setCounterData] = useState({
    amount: "",
    message: "",
  });

  // =========================================
  // FETCH PROPERTY + OFFERS
  // =========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [propertyResponse, offersResponse] = await Promise.all([
        api.get(`/properties/${propertyId}`),
        api.get(`/offers/property/${propertyId}`),
      ]);

      setProperty(propertyResponse.data);
      setOffers(offersResponse.data || []);
    } catch (error) {
      console.error("Failed to load property offers:", error);

      toast.error(
        error.response?.data?.message || "Failed to load property offers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "N/A";
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
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================================
  // FORMAT STATUS
  // =========================================

  const formatStatus = (status) => {
    if (!status) {
      return "";
    }

    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "property-offers-status-pending";

      case "ACCEPTED":
        return "property-offers-status-accepted";

      case "REJECTED":
        return "property-offers-status-rejected";

      case "COUNTERED":
        return "property-offers-status-countered";

      default:
        return "";
    }
  };

  // =========================================
  // ACCEPT OFFER
  // =========================================

  const handleAccept = async (offerId) => {
    try {
      setActionLoading(offerId);

      await api.put(`/offers/${offerId}/accept`);

      toast.success("Offer accepted successfully");

      await fetchData();
    } catch (error) {
      console.error("Failed to accept offer:", error);

      toast.error(error.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================
  // REJECT OFFER
  // =========================================

  const handleReject = async (offerId) => {
    try {
      setActionLoading(offerId);

      await api.put(`/offers/${offerId}/reject`);

      toast.success("Offer rejected successfully");

      await fetchData();
    } catch (error) {
      console.error("Failed to reject offer:", error);

      toast.error(error.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================
  // OPEN COUNTER MODAL
  // =========================================

  const handleOpenCounter = (offer) => {
    setSelectedOffer(offer);

    setCounterData({
      amount: offer.amount || "",
      message: "",
    });

    setShowCounterModal(true);
  };

  // =========================================
  // CLOSE COUNTER MODAL
  // =========================================

  const handleCloseCounter = () => {
    setShowCounterModal(false);
    setSelectedOffer(null);

    setCounterData({
      amount: "",
      message: "",
    });
  };

  // =========================================
  // COUNTER INPUT
  // =========================================

  const handleCounterChange = (event) => {
    const { name, value } = event.target;

    setCounterData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================================
  // SUBMIT COUNTER
  // =========================================

  const handleCounterSubmit = async (event) => {
    event.preventDefault();

    if (!selectedOffer) {
      return;
    }

    const amount = Number(counterData.amount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid counter offer amount");
      return;
    }

    try {
      setActionLoading(selectedOffer.id);

      await api.put(`/offers/${selectedOffer.id}/counter`, {
        amount,
        message: counterData.message.trim(),
      });

      toast.success("Counter offer sent successfully");

      handleCloseCounter();

      await fetchData();
    } catch (error) {
      console.error("Failed to send counter offer:", error);

      toast.error(
        error.response?.data?.message || "Failed to send counter offer",
      );
    } finally {
      setActionLoading(null);
    }
  };

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
    <div className="property-offers-page">
      {/* =========================================
                    SIDEBAR
          ========================================= */}

      <SellerSidebar />

      {/* =========================================
                    MAIN CONTENT
          ========================================= */}

      <main className="property-offers-main">
        {/* Header */}

        <SellerTopbar title="Property Offers" />

        {/* =========================================
                    LOADING
          ========================================= */}

        {loading && (
          <div className="property-offers-loading">
            <div className="property-offers-spinner"></div>

            <p>Loading property offers...</p>
          </div>
        )}

        {/* =========================================
                    CONTENT
          ========================================= */}

        {!loading && property && (
          <>
            {/* Property Summary */}

            <section className="property-offers-property-card">
              <div className="property-offers-property-icon">🏠</div>

              <div className="property-offers-property-info">
                <span>{property.propertyType}</span>

                <h2>{property.title}</h2>

                <p>⌖ {property.location}</p>
              </div>

              <div className="property-offers-property-price">
                <small>Asking Price</small>

                <strong>{formatPrice(property.price)}</strong>
              </div>
            </section>

            {/* Statistics */}

            <section className="property-offers-stats">
              <div className="property-offers-stat">
                <span>Total Offers</span>

                <strong>{totalOffers}</strong>
              </div>

              <div className="property-offers-stat">
                <span>Pending</span>

                <strong>{pendingOffers}</strong>
              </div>

              <div className="property-offers-stat">
                <span>Countered</span>

                <strong>{counteredOffers}</strong>
              </div>

              <div className="property-offers-stat">
                <span>Accepted</span>

                <strong>{acceptedOffers}</strong>
              </div>
            </section>

            {/* Offers */}

            <section className="property-offers-section">
              <div className="property-offers-section-heading">
                <div>
                  <p>BUYER OFFERS</p>

                  <h3>Offers for this property</h3>
                </div>

                <span>
                  {totalOffers} offer
                  {totalOffers !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Empty */}

              {offers.length === 0 && (
                <div className="property-offers-empty">
                  <div>📄</div>

                  <h3>No offers yet</h3>

                  <p>
                    Buyers haven't submitted any offers for this property yet.
                  </p>
                </div>
              )}

              {/* Offer List */}

              {offers.length > 0 && (
                <div className="property-offers-list">
                  {offers.map((offer) => (
                    <article className="property-offer-card" key={offer.id}>
                      {/* Buyer */}

                      <div className="property-offer-buyer">
                        <div className="property-offer-avatar">
                          {(offer.buyer?.name || offer.buyer?.email || "B")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h4>{offer.buyer?.name || "Buyer"}</h4>

                          <span>{offer.buyer?.email || "Buyer account"}</span>
                        </div>
                      </div>

                      {/* Offer Details */}

                      <div className="property-offer-details">
                        <div>
                          <small>OFFER AMOUNT</small>

                          <strong>{formatPrice(offer.amount)}</strong>
                        </div>

                        <div>
                          <small>SUBMITTED</small>

                          <span>{formatDate(offer.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status */}

                      <div className="property-offer-status">
                        <span className={getStatusClass(offer.status)}>
                          {formatStatus(offer.status)}
                        </span>
                      </div>

                      {/* Message */}

                      {offer.message && (
                        <div className="property-offer-message">
                          <small>BUYER MESSAGE</small>

                          <p>"{offer.message}"</p>
                        </div>
                      )}

                      {/* Actions */}

                      {(offer.status === "PENDING" ||
                        offer.status === "COUNTERED") && (
                        <div className="property-offer-actions">
                          {offer.status === "PENDING" && (
                            <>
                              <button
                                className="property-offer-accept"
                                disabled={actionLoading === offer.id}
                                onClick={() => handleAccept(offer.id)}
                              >
                                {actionLoading === offer.id ? "..." : "Accept"}
                              </button>

                              <button
                                className="property-offer-counter"
                                disabled={actionLoading === offer.id}
                                onClick={() => handleOpenCounter(offer)}
                              >
                                Counter
                              </button>

                              <button
                                className="property-offer-reject"
                                disabled={actionLoading === offer.id}
                                onClick={() => handleReject(offer.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {offer.status === "COUNTERED" && (
                            <span className="property-offer-counter-info">
                              Counter offer already sent
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* =========================================
                    COUNTER MODAL
          ========================================= */}

        {showCounterModal && selectedOffer && (
          <div className="property-offers-modal-overlay">
            <div className="property-offers-modal">
              <div className="property-offers-modal-header">
                <div>
                  <p>NEGOTIATE OFFER</p>

                  <h3>Send Counter Offer</h3>
                </div>

                <button type="button" onClick={handleCloseCounter}>
                  ×
                </button>
              </div>

              <div className="property-offers-modal-original">
                <span>Buyer's current offer</span>

                <strong>{formatPrice(selectedOffer.amount)}</strong>
              </div>

              <form
                onSubmit={handleCounterSubmit}
                className="property-offers-counter-form"
              >
                <div className="property-offers-form-group">
                  <label>Counter Offer Amount</label>

                  <input
                    type="number"
                    name="amount"
                    value={counterData.amount}
                    onChange={handleCounterChange}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="property-offers-form-group">
                  <label>Message</label>

                  <textarea
                    name="message"
                    value={counterData.message}
                    onChange={handleCounterChange}
                    placeholder="Add a message to the buyer..."
                    rows="4"
                  />
                </div>

                <div className="property-offers-modal-actions">
                  <button
                    type="button"
                    className="property-offers-modal-cancel"
                    onClick={handleCloseCounter}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="property-offers-modal-submit"
                    disabled={actionLoading === selectedOffer.id}
                  >
                    {actionLoading === selectedOffer.id
                      ? "Sending..."
                      : "Send Counter Offer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyOffers;
