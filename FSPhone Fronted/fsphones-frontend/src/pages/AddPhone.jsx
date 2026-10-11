
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE_URL, getCsrfToken } from "../api";

import {
  ArrowLeft,
  Smartphone,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";


function AddPhone() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState({
    brand: "",
    model: "",
    condition: "",
    price: "",
    ram: "",
    storage: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(e) {
    const { name, value } = e.target;

    setPhone((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    setPhone((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  }

async function handleSubmit(e) {

    e.preventDefault();

    const form = e.currentTarget;

    setErrorMessage("");
    setSuccessMessage("");

    if (!phone.image) {
      setErrorMessage("Please select a phone image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("brand", phone.brand);
    formData.append("model", phone.model);
    formData.append("condition", phone.condition);
    formData.append("price", phone.price);
    formData.append("ram", phone.ram);
    formData.append("storage", phone.storage);
    formData.append("description", phone.description);
    formData.append("image", phone.image);

    
    let csrfToken;

try {
  csrfToken = await getCsrfToken();
} catch (error) {
  setErrorMessage(error.message || "Could not get security token.");
  setLoading(false);
  return;
}

fetch(`${API_BASE_URL}/phones/with-image`, {
  method: "POST",
  credentials: "include",
  headers: {
    "X-XSRF-TOKEN": csrfToken,
  },
  body: formData,
})

      .then(async (response) => {
        if (!response.ok) {
          let message = "Failed to add phone.";

          try {
            const data = await response.json();
            if (data.message) message = data.message;
          } catch {
            // Keep the default message if the response isn't JSON.
          }

          throw new Error(message);
        }

        setSuccessMessage("Phone and image added successfully.");

        setPhone({
          brand: "",
          model: "",
          condition: "",
          price: "",
          ram: "",
          storage: "",
          description: "",
          image: null,
        });

       setImagePreview("");
        form.reset();
      })
      .catch((error) => {
        console.error("Add phone error:", error);
        setErrorMessage(
          error.message || "Could not connect to the server."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <main className="add-phone-page">
      <div className="add-phone-container">
        <Link to="/admin-dashboard" className="add-phone-back">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <section className="add-phone-card">
          <header className="add-phone-heading">
            <div className="add-phone-title-icon">
              <Smartphone size={27} />
            </div>

            <span className="add-phone-eyebrow">
              FSPhones Inventory
            </span>

            <h1>Add a Phone</h1>
            <p>
              Enter the phone details and upload a clear image to add
              it to your store.
            </p>

            <div className="add-phone-security-note">
              <ShieldCheck size={16} />
              Admin inventory management
            </div>
          </header>

          <form className="add-phone-form" onSubmit={handleSubmit}>
            <section className="add-phone-form-section">
              <div className="form-section-title">
                <span>01</span>
                <div>
                  <h2>Phone Information</h2>
                  <p>Enter the phone's details and specifications.</p>
                </div>
              </div>

              <div className="form-grid">
                <label className="add-phone-field">
                  <span>Brand <b>*</b></span>
                  <input
                    name="brand"
                    placeholder="e.g. Apple"
                    value={phone.brand}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-phone-field">
                  <span>Model <b>*</b></span>
                  <input
                    name="model"
                    placeholder="e.g. iPhone 15"
                    value={phone.model}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-phone-field">
                  <span>Condition <b>*</b></span>
                  <select
                    name="condition"
                    value={phone.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="NEW">New</option>
                    <option value="USED">Used</option>
                  </select>
                </label>

                <label className="add-phone-field">
                  <span>Price (₹) <b>*</b></span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 59999"
                    value={phone.price}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-phone-field">
                  <span>RAM <b>*</b></span>
                  <input
                    name="ram"
                    placeholder="e.g. 8GB"
                    value={phone.ram}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="add-phone-field">
                  <span>Storage <b>*</b></span>
                  <input
                    name="storage"
                    placeholder="e.g. 256GB"
                    value={phone.storage}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="add-phone-form-section">
              <div className="form-section-title">
                <span>02</span>
                <div>
                  <h2>Description and Image</h2>
                  <p>Give customers more information about this phone.</p>
                </div>
              </div>

              <label className="add-phone-field description-field">
                <span>Description <b>*</b></span>
                <textarea
                  name="description"
                  placeholder="Describe the phone, its condition, and any important details..."
                  value={phone.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </label>

              <div className="add-phone-upload-heading">
                <span>Phone Image <b>*</b></span>
                <small>Choose a clear product photo</small>
              </div>

              <label className="image-upload-area">
                {imagePreview ? (
                  <img
                    className="add-phone-image-preview"
                    src={imagePreview}
                    alt="Selected phone preview"
                  />
                ) : (
                  <div className="upload-placeholder-icon">
                    <Upload size={27} />
                  </div>
                )}

                <strong>
                  {phone.image ? "Change phone image" : "Upload phone image"}
                </strong>

                <span>
                  {phone.image
                    ? phone.image.name
                    : "Click here to select an image from your device"}
                </span>

                <small>Image files only</small>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!phone.image}
                />
              </label>

              {imagePreview && (
                <div className="add-phone-image-selected">
                  <CheckCircle2 size={17} />
                  <span>Image selected successfully</span>
                  <ImageIcon size={17} />
                </div>
              )}
            </section>

            {errorMessage && (
              <div className="add-phone-feedback add-phone-error" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                className="add-phone-feedback add-phone-success"
                role="status"
              >
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            <div className="add-phone-form-footer">
              <p>
                <b>*</b> Required fields
              </p>

              <button
                className="add-phone-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="add-phone-spin" size={18} />
                    Adding Phone...
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Add Phone to Store
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function PlusIcon() {
  return <span className="add-phone-plus-icon">+</span>;
}

export default AddPhone;
