import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import api from "../../services/api";
import SellerSidebar from "../../components/SellerSidebar";
import SellerTopbar from "../../components/SellerTopbar";

import "../../styles/seller/PropertyForm.css";

const propertyFormInitialData = {
  title: "",
  description: "",
  price: "",
  location: "",
  propertyType: "HOUSE",
  bedrooms: "",
  bathrooms: "",
  imageUrl: "",
};

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(propertyFormInitialData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProperty = async () => {
      try {
        setFetching(true);

        const response = await api.get(`/properties/${id}`);

        const property = response.data;

        setFormData({
          title: property.title ?? "",
          description: property.description ?? "",
          price: property.price ?? "",
          location: property.location ?? "",
          propertyType: property.propertyType ?? "HOUSE",
          bedrooms: property.bedrooms ?? "",
          bathrooms: property.bathrooms ?? "",
          imageUrl: property.imageUrl ?? "",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load property"
        );

        navigate("/seller/properties");
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.location.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        location: formData.location.trim(),
        propertyType: formData.propertyType,
        bedrooms:
          formData.bedrooms === ""
            ? null
            : Number(formData.bedrooms),
        bathrooms:
          formData.bathrooms === ""
            ? null
            : Number(formData.bathrooms),
        imageUrl: formData.imageUrl.trim(),
      };

      if (isEditMode) {
        await api.put(`/properties/${id}`, requestData);

        toast.success("Property updated successfully");
      } else {
        await api.post("/properties", requestData);

        toast.success("Property created successfully");
      }

      navigate("/seller/properties");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} property`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="property-form-page">
        <SellerSidebar />

        <main className="property-form-main">
          <SellerTopbar
            title={isEditMode ? "Edit Property" : "Add Property"}
          />

          <div className="property-form-loading">
            <div className="property-form-loading-spinner"></div>

            <p>Loading property...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="property-form-page">
      <SellerSidebar />

      <main className="property-form-main">
        <SellerTopbar
          title={isEditMode ? "Edit Property" : "Add Property"}
        />

        <section className="property-form-content">
          <div className="property-form-card">

            {/* CARD HEADER */}

            <div className="property-form-card-header">
              <div>
                <h2>Property Information</h2>

                <p>
                  {isEditMode
                    ? "Update your property listing details."
                    : "Add the details of your property listing."}
                </p>
              </div>
            </div>

            {/* FORM */}

            <form
              className="property-form-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="property-form-field property-form-field-full">
                <label htmlFor="property-form-title">
                  Property Title
                  <span>*</span>
                </label>

                <input
                  id="property-form-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern 3 Bedroom House"
                />
              </div>

              {/* PROPERTY TYPE */}

              <div className="property-form-field">
                <label htmlFor="property-form-type">
                  Property Type
                  <span>*</span>
                </label>

                <select
                  id="property-form-type"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              {/* PRICE */}

              <div className="property-form-field">
                <label htmlFor="property-form-price">
                  Price
                  <span>*</span>
                </label>

                <div className="property-form-price-wrapper">
                  <span>Rs.</span>

                  <input
                    id="property-form-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div className="property-form-field property-form-field-full">
                <label htmlFor="property-form-location">
                  Location
                  <span>*</span>
                </label>

                <input
                  id="property-form-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Colombo 07"
                />
              </div>

              {/* BEDROOMS */}

              <div className="property-form-field">
                <label htmlFor="property-form-bedrooms">
                  Bedrooms
                </label>

                <input
                  id="property-form-bedrooms"
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="Number of bedrooms"
                  min="0"
                />
              </div>

              {/* BATHROOMS */}

              <div className="property-form-field">
                <label htmlFor="property-form-bathrooms">
                  Bathrooms
                </label>

                <input
                  id="property-form-bathrooms"
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Number of bathrooms"
                  min="0"
                />
              </div>

              {/* IMAGE URL */}

              <div className="property-form-field property-form-field-full">
                <label htmlFor="property-form-image">
                  Property Image URL
                </label>

                <input
                  id="property-form-image"
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/property-image.jpg"
                />

                <small className="property-form-help-text">
                  Paste a direct link to the property image.
                </small>

                {formData.imageUrl.trim() && (
                  <div className="property-form-image-preview">
                    <img
                      src={formData.imageUrl}
                      alt="Property preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}

              <div className="property-form-field property-form-field-full">
                <label htmlFor="property-form-description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="property-form-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="6"
                />
              </div>

              {/* ACTIONS */}

              <div className="property-form-actions">

                <button
                  type="button"
                  className="property-form-cancel-button"
                  onClick={() => navigate("/seller/properties")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="property-form-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="property-form-submit-spinner"></span>

                      {isEditMode
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditMode
                        ? "Update Property"
                        : "Create Property"}

                      <span>→</span>
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PropertyForm;