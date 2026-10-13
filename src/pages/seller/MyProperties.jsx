import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SellerTopbar from "../../components/SellerTopbar";
import api from "../../services/api";
import SellerSidebar from "../../components/SellerSidebar";
import "../../styles/seller/MyProperties.css";

const MyProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // =========================================
  // FETCH PROPERTIES
  // =========================================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await api.get("/properties/my");

      setProperties(response.data || []);
    } catch (error) {
      console.error("Failed to load properties:", error);

      toast.error(
        error.response?.data?.message || "Failed to load your properties",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // =========================================
  // OPEN DELETE CONFIRMATION
  // =========================================

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  // =========================================
  // CLOSE DELETE CONFIRMATION
  // =========================================

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  // =========================================
  // DELETE PROPERTY
  // =========================================

  const handleDelete = async () => {
    if (!propertyToDelete) {
      return;
    }

    const propertyId = propertyToDelete.id;

    try {
      setDeletingId(propertyId);

      await api.delete(`/properties/${propertyId}`);

      setProperties((currentProperties) =>
        currentProperties.filter((property) => property.id !== propertyId),
      );

      toast.success("Property deleted successfully");

      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error("Failed to delete property:", error);

      toast.error(error.response?.data?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "status-available";

      case "UNDER_OFFER":
        return "status-under-offer";

      case "SOLD":
        return "status-sold";

      default:
        return "";
    }
  };

  // =========================================
  // FORMAT PROPERTY TYPE
  // =========================================

  const formatPropertyType = (type) => {
    if (!type) {
      return "";
    }

    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

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

  return (
    <div className="seller-properties-page">
      {/* =========================================
                    SIDEBAR
          ========================================= */}

     <SellerSidebar />

      {/* =========================================
                    MAIN CONTENT
          ========================================= */}

      <main className="properties-main">
        {/* Header */}

       <SellerTopbar title="My Properties" />

        {/* Content */}

        <section className="properties-content">
          <div className="properties-title-row">
            <div>
              <h2>Your Listings</h2>

              <p>Manage your property listings</p>
            </div>

            <div className="property-count">{properties.length} properties</div>
          </div>

          {/* Loading */}

          {loading && (
            <div className="properties-loading">
              <div className="properties-spinner"></div>

              <p>Loading your properties...</p>
            </div>
          )}

          {/* Empty */}

          {!loading && properties.length === 0 && (
            <div className="properties-empty">
              <div className="empty-property-icon">🏠</div>

              <h3>No properties yet</h3>

              <p>You haven't created any property listings yet.</p>

              <button onClick={() => navigate("/seller/properties/create")}>
                Create Your First Property
              </button>
            </div>
          )}

          {/* Property Grid */}

          {!loading && properties.length > 0 && (
            <div className="property-grid">
              {properties.map((property) => (
                <article className="property-card" key={property.id}>
                  {/* =====================================
                                PROPERTY IMAGE
                      ===================================== */}

                  <div className="property-card-image">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="property-card-image-fallback"
                      style={{
                        display: property.imageUrl ? "none" : "flex",
                      }}
                    >
                      🏠
                    </div>

                    <span
                      className={`property-status ${getStatusClass(
                        property.status,
                      )}`}
                    >
                      {formatPropertyType(property.status)}
                    </span>
                  </div>

                  {/* =====================================
                                CARD BODY
                      ===================================== */}

                  <div className="property-card-body">
                    <div className="property-card-type">
                      {formatPropertyType(property.propertyType)}
                    </div>

                    <h3>{property.title}</h3>

                    <div className="property-location">
                      <span>⌖</span>

                      {property.location}
                    </div>

                    <div className="property-price">
                      {formatPrice(property.price)}
                    </div>

                    <div className="property-features">
                      <span>🛏 {property.bedrooms ?? 0} Beds</span>

                      <span>🛁 {property.bathrooms ?? 0} Baths</span>
                    </div>

                    {/* Actions */}

                    <div className="property-card-actions">
                      {/* Edit */}

                      <button
                        className="property-edit-btn"
                        disabled={property.status !== "AVAILABLE"}
                        onClick={() =>
                          navigate(`/seller/properties/edit/${property.id}`)
                        }
                      >
                        Edit
                      </button>

                      {/* Offers */}

                      <button
                        className="property-offers-btn"
                        onClick={() =>
                          navigate(`/seller/properties/${property.id}/offers`)
                        }
                      >
                        Offers
                      </button>

                      {/* Delete */}

                      <button
                        className="property-delete-btn"
                        disabled={
                          deletingId === property.id ||
                          property.status !== "AVAILABLE"
                        }
                        onClick={() => handleDeleteClick(property)}
                      >
                        {deletingId === property.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =========================================
              DELETE CONFIRMATION MODAL
          ========================================= */}

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">⚠️</div>

            <h3>Delete Property?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{propertyToDelete?.title}</strong>?
            </p>

            <p className="delete-modal-warning">
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={handleCancelDelete}
                disabled={deletingId !== null}
              >
                Cancel
              </button>

              <button
                className="delete-modal-confirm"
                onClick={handleDelete}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? "Deleting..." : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
