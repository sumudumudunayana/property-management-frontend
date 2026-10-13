import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BuyerSidebar from "../../components/BuyerSidebar";
import "../../styles/buyer/BuyerProperties.css";
import BuyerTopbar from "../../components/BuyerTopbar";

const BuyerProperties = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  const [offerData, setOfferData] = useState({
    amount: "",
    message: "",
  });

  const [offerSubmitting, setOfferSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const response = await api.get("/properties");

      setProperties(response.data);
    } catch (error) {
      console.error("Failed to load properties:", error);

      toast.error(error.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getPropertyTypeLabel = (type) => {
    if (!type) return "Property";

    return type
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================
  // OPEN PROPERTY DETAILS
  // =========================================

  const handleViewDetails = async (propertyId) => {
    try {
      setDetailsLoading(true);

      const response = await api.get(`/properties/${propertyId}`);

      setSelectedProperty(response.data);
    } catch (error) {
      console.error("Failed to load property details:", error);

      toast.error(
        error.response?.data?.message || "Failed to load property details",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================================
  // CLOSE PROPERTY DETAILS
  // =========================================

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCloseDetails();
    }
  };

  // =========================================
  // OPEN OFFER FORM
  // =========================================

  const handleOpenOfferForm = () => {
    if (selectedProperty?.status !== "AVAILABLE") {
      toast.info("This property is no longer available for offers");
      return;
    }

    setOfferData({
      amount: "",
      message: "",
    });

    setShowOfferForm(true);
  };

  // =========================================
  // CLOSE OFFER FORM
  // =========================================

  const handleCloseOfferForm = () => {
    if (offerSubmitting) {
      return;
    }

    setShowOfferForm(false);
  };

  // =========================================
  // HANDLE OFFER INPUT
  // =========================================

  const handleOfferChange = (event) => {
    const { name, value } = event.target;

    setOfferData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // SUBMIT OFFER
  // =========================================

  const handleSubmitOffer = async (event) => {
    event.preventDefault();

    if (!offerData.amount) {
      toast.error("Please enter an offer amount");
      return;
    }

    const amount = Number(offerData.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }

    if (selectedProperty?.status !== "AVAILABLE") {
      toast.error("This property is no longer available for offers");
      return;
    }

    if (selectedProperty?.price && amount > selectedProperty.price) {
      toast.error("Offer amount cannot be higher than the property price");
      return;
    }

    try {
      setOfferSubmitting(true);

      await api.post(`/offers/property/${selectedProperty.id}`, {
        amount: amount,
        message: offerData.message.trim(),
      });

      toast.success("Offer submitted successfully");

      setShowOfferForm(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Failed to submit offer:", error);

      toast.error(error.response?.data?.message || "Failed to submit offer");
    } finally {
      setOfferSubmitting(false);
    }
  };

  // =========================================
  // FILTER PROPERTIES
  // =========================================

  const filteredProperties = properties.filter((property) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      property.title?.toLowerCase().includes(search) ||
      property.location?.toLowerCase().includes(search) ||
      property.description?.toLowerCase().includes(search);

    const matchesType =
      propertyType === "ALL" || property.propertyType === propertyType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="buyer-properties-page">
      {/* =========================================
                SIDEBAR
            ========================================= */}

       <BuyerSidebar />

      {/* =========================================
                MAIN CONTENT
            ========================================= */}

      <main className="buyer-properties-main">
       <BuyerTopbar title="Browse Properties" />

        {/* =========================================
                    PAGE INTRO
                ========================================= */}

        <section className="buyer-properties-intro">
          <div>
            <p>AVAILABLE PROPERTIES</p>

            <h1>
              Find a property
              <span> you'll love.</span>
            </h1>

            <span className="buyer-properties-count">
              {properties.length} properties available
            </span>
          </div>
        </section>

        {/* =========================================
                    SEARCH + FILTER
                ========================================= */}

        <section className="buyer-properties-filters">
          <div className="buyer-properties-search">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search by title, location or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="buyer-properties-type-filter">
            <label>Property Type</label>

            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="LAND">Land</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>
        </section>

        {/* =========================================
                    PROPERTY CONTENT
                ========================================= */}

        <section className="buyer-properties-content">
          <div className="buyer-properties-section-header">
            <div>
              <p>PROPERTY LISTINGS</p>

              <h3>Available Properties</h3>
            </div>

            {!loading && (
              <span className="buyer-properties-result-count">
                {filteredProperties.length} result
                {filteredProperties.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading */}

          {loading && (
            <div className="buyer-properties-loading">
              <div className="buyer-properties-spinner"></div>

              <p>Loading properties...</p>
            </div>
          )}

          {/* Empty */}

          {!loading && filteredProperties.length === 0 && (
            <div className="buyer-properties-empty">
              <div className="buyer-properties-empty-icon">🏠</div>

              <h4>No properties found</h4>

              <p>Try changing your search or property type filter.</p>

              {(searchTerm || propertyType !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPropertyType("ALL");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Property Cards */}

          {!loading && filteredProperties.length > 0 && (
            <div className="buyer-properties-grid">
              {filteredProperties.map((property) => (
                <article className="buyer-properties-card" key={property.id}>
                  <div className="buyer-properties-card-image">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";

                          const fallback =
                            event.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="buyer-properties-card-house"
                      style={{
                        display: property.imageUrl ? "none" : "block",
                      }}
                    >
                      🏠
                    </div>

                    <span className="buyer-properties-card-type">
                      {getPropertyTypeLabel(property.propertyType)}
                    </span>

                    <span className="buyer-properties-card-status">
                      Available
                    </span>
                  </div>

                  <div className="buyer-properties-card-body">
                    <h4>{property.title}</h4>

                    <div className="buyer-properties-location">
                      <span>📍</span>

                      <span>{property.location}</span>
                    </div>

                    <div className="buyer-properties-details">
                      {property.bedrooms !== null &&
                        property.bedrooms !== undefined && (
                          <div>
                            <span>🛏</span>

                            <strong>{property.bedrooms}</strong>

                            <small>Beds</small>
                          </div>
                        )}

                      {property.bathrooms !== null &&
                        property.bathrooms !== undefined && (
                          <div>
                            <span>🚿</span>

                            <strong>{property.bathrooms}</strong>

                            <small>Baths</small>
                          </div>
                        )}
                    </div>

                    {property.description && (
                      <p className="buyer-properties-description">
                        {property.description}
                      </p>
                    )}

                    <div className="buyer-properties-card-footer">
                      <div className="buyer-properties-price">
                        <small>PRICE</small>

                        <strong>{formatPrice(property.price)}</strong>
                      </div>

                      <button
                        className="buyer-properties-view-btn"
                        onClick={() => handleViewDetails(property.id)}
                      >
                        View Details
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* =========================================
                    FOOTER
                ========================================= */}

        <footer className="buyer-properties-footer">
          <span>© 2026 PropertyHub</span>

          <span>Property Management Platform</span>
        </footer>
      </main>

      {/* =========================================
                PROPERTY DETAILS POPUP
            ========================================= */}

      {(selectedProperty || detailsLoading) && (
        <div
          className="buyer-property-modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="buyer-property-modal">
            {/* Loading */}

            {detailsLoading && !selectedProperty && (
              <div className="buyer-property-modal-loading">
                <div className="buyer-property-modal-spinner"></div>

                <p>Loading property details...</p>
              </div>
            )}

            {/* Details */}

            {selectedProperty && !detailsLoading && (
              <>
                {/* Modal Header */}

                <div className="buyer-property-modal-header">
                  <div>
                    <span className="buyer-property-modal-type">
                      {getPropertyTypeLabel(selectedProperty.propertyType)}
                    </span>

                    <h2>{selectedProperty.title}</h2>
                  </div>

                  <button
                    className="buyer-property-modal-close"
                    onClick={handleCloseDetails}
                  >
                    ×
                  </button>
                </div>

                {/* Modal Image */}

                <div className="buyer-property-modal-image">
                  {selectedProperty.imageUrl ? (
                    <img
                      src={selectedProperty.imageUrl}
                      alt={selectedProperty.title}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";

                        const fallback =
                          event.currentTarget.nextElementSibling;

                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}

                  <div
                    style={{
                      display: selectedProperty.imageUrl ? "none" : "flex",
                    }}
                  >
                    🏠
                  </div>

                  <span>
                    {selectedProperty.status === "AVAILABLE"
                      ? "Available"
                      : getPropertyTypeLabel(selectedProperty.status)}
                  </span>
                </div>

                {/* Modal Body */}

                <div className="buyer-property-modal-body">
                  {/* Price */}

                  <div className="buyer-property-modal-price">
                    <small>PROPERTY PRICE</small>

                    <strong>{formatPrice(selectedProperty.price)}</strong>
                  </div>

                  {/* Location */}

                  <div className="buyer-property-modal-location">
                    <span>📍</span>

                    <div>
                      <small>LOCATION</small>

                      <strong>{selectedProperty.location}</strong>
                    </div>
                  </div>

                  {/* Details */}

                  <div className="buyer-property-modal-details">
                    {selectedProperty.bedrooms !== null &&
                      selectedProperty.bedrooms !== undefined && (
                        <div>
                          <span>🛏</span>

                          <div>
                            <small>BEDROOMS</small>

                            <strong>{selectedProperty.bedrooms}</strong>
                          </div>
                        </div>
                      )}

                    {selectedProperty.bathrooms !== null &&
                      selectedProperty.bathrooms !== undefined && (
                        <div>
                          <span>🚿</span>

                          <div>
                            <small>BATHROOMS</small>

                            <strong>{selectedProperty.bathrooms}</strong>
                          </div>
                        </div>
                      )}

                    <div>
                      <span>🏷</span>

                      <div>
                        <small>TYPE</small>

                        <strong>
                          {getPropertyTypeLabel(selectedProperty.propertyType)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Description */}

                  <div className="buyer-property-modal-description">
                    <small>DESCRIPTION</small>

                    <p>
                      {selectedProperty.description ||
                        "No description provided for this property."}
                    </p>
                  </div>

                  {/* Seller */}

                  {selectedProperty.seller && (
                    <div className="buyer-property-modal-seller">
                      <div className="buyer-property-modal-seller-avatar">
                        {selectedProperty.seller?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <small>LISTED BY</small>

                        <strong>{selectedProperty.seller?.name}</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}

                <div className="buyer-property-modal-footer">
                  <button
                    className="buyer-property-modal-secondary"
                    onClick={handleCloseDetails}
                  >
                    Close
                  </button>

                  {selectedProperty.status === "AVAILABLE" && (
                    <button
                      className="buyer-property-modal-offer"
                      onClick={handleOpenOfferForm}
                    >
                      Make an Offer
                      <span>→</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
                MAKE OFFER MODAL
            ========================================= */}

      {showOfferForm && selectedProperty && (
        <div className="buyer-offer-modal-overlay">
          <div className="buyer-offer-modal">
            {/* Header */}

            <div className="buyer-offer-modal-header">
              <div>
                <span>MAKE AN OFFER</span>

                <h2>Submit your offer</h2>

                <p>Send an offer to the seller for this property.</p>
              </div>

              <button
                type="button"
                className="buyer-offer-modal-close"
                onClick={handleCloseOfferForm}
                disabled={offerSubmitting}
              >
                ×
              </button>
            </div>

            {/* Property Summary */}

            <div className="buyer-offer-property-summary">
              <div className="buyer-offer-property-icon">
                {selectedProperty.imageUrl ? (
                  <img
                    src={selectedProperty.imageUrl}
                    alt={selectedProperty.title}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";

                      const fallback =
                        event.currentTarget.nextElementSibling;

                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}

                <span
                  style={{
                    display: selectedProperty.imageUrl ? "none" : "flex",
                  }}
                >
                  🏠
                </span>
              </div>

              <div className="buyer-offer-property-info">
                <strong>{selectedProperty.title}</strong>

                <span>📍 {selectedProperty.location}</span>
              </div>

              <div className="buyer-offer-property-price">
                <small>LIST PRICE</small>

                <strong>{formatPrice(selectedProperty.price)}</strong>
              </div>
            </div>

            {/* Offer Form */}

            <form className="buyer-offer-form" onSubmit={handleSubmitOffer}>
              {/* Amount */}

              <div className="buyer-offer-form-group">
                <label htmlFor="offerAmount">Offer Amount</label>

                <div className="buyer-offer-amount-input">
                  <span>$</span>

                  <input
                    id="offerAmount"
                    type="number"
                    name="amount"
                    placeholder="Enter your offer amount"
                    value={offerData.amount}
                    onChange={handleOfferChange}
                    min="1"
                    step="0.01"
                    required
                    disabled={offerSubmitting}
                  />
                </div>

                <small>
                  Enter the amount you are willing to pay for this property.
                </small>
              </div>

              {/* Message */}

              <div className="buyer-offer-form-group">
                <label htmlFor="offerMessage">
                  Message
                  <span>Optional</span>
                </label>

                <textarea
                  id="offerMessage"
                  name="message"
                  placeholder="Add a message to the seller..."
                  value={offerData.message}
                  onChange={handleOfferChange}
                  rows="5"
                  maxLength="500"
                  disabled={offerSubmitting}
                />

                <small>
                  You can include any additional information for the seller.
                </small>
              </div>

              {/* Information */}

              <div className="buyer-offer-information">
                <span>ℹ</span>

                <p>
                  Your offer will be sent to the seller for review. The seller
                  can accept, reject, or make a counter offer.
                </p>
              </div>

              {/* Footer */}

              <div className="buyer-offer-modal-footer">
                <button
                  type="button"
                  className="buyer-offer-cancel-btn"
                  onClick={handleCloseOfferForm}
                  disabled={offerSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="buyer-offer-submit-btn"
                  disabled={offerSubmitting}
                >
                  {offerSubmitting ? (
                    <>
                      <span className="buyer-offer-button-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Offer
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProperties;