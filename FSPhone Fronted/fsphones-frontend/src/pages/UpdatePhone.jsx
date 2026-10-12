
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { API_BASE_URL, getCsrfToken, getAuthHeaders } from "../api";

import {
  ArrowLeft,
  Smartphone,
  Save,
  LoaderCircle,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


function UpdatePhone() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [phone, setPhone] = useState({
    brand: "",
    model: "",
    condition: "",
    price: "",
    ram: "",
    storage: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadPhone() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/phones/${id}`);

        if (!response.ok) {
          throw new Error("Could not load this phone's details.");
        }

        const data = await response.json();

        if (!cancelled) {
          setPhone({
            brand: data.brand ?? "",
            model: data.model ?? "",
            condition: data.condition ?? "",
            price: data.price ?? "",
            ram: data.ram ?? "",
            storage: data.storage ?? "",
            description: data.description ?? "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message || "Unable to connect to the server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPhone();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setPhone((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
   

     
      let csrfToken = null;
      try {
        csrfToken = await getCsrfToken();
      } catch {
        // CSRF token is optional when token authentication is used
      }

      const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };
      if (csrfToken) {
        headers["X-XSRF-TOKEN"] = csrfToken;
      }

      const response = await fetch(
        `${API_BASE_URL}/phones/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers,
          body: JSON.stringify({
            ...phone,
            price: Number(phone.price),
          }),
        }
      );


      if (!response.ok) {
        throw new Error("Failed to update phone. Please try again.");
      }

      setSuccessMessage("Phone updated successfully.");

      window.setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.message || "Server connection failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="update-page update-state">
        <LoaderCircle className="update-spinner" size={30} />
        <p>Loading phone details...</p>
      </main>
    );
  }

  return (
    <main className="update-page">
      <div className="update-container">
        <Link to="/" className="update-back-link">
          <ArrowLeft size={17} />
          Back to Store
        </Link>

        <section className="update-card">
          <header className="update-heading">
            <div className="update-title-icon">
              <Smartphone size={27} />
            </div>

            <span className="update-eyebrow">FSPhones Inventory</span>
            <h1>Update Phone</h1>
            <p>
              Edit the phone information below and save your changes.
            </p>

            <div className="update-security-note">
              <ShieldCheck size={16} />
              Admin inventory management
            </div>
          </header>

          <form className="update-form" onSubmit={handleUpdate}>
            <div className="update-form-section-heading">
              <span>PHONE DETAILS</span>
              <small>Phone ID: {id}</small>
            </div>

            <div className="update-fields-grid">
              <label className="update-field">
                <span>Brand</span>
                <input
                  name="brand"
                  placeholder="e.g. Apple"
                  value={phone.brand}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="update-field">
                <span>Model</span>
                <input
                  name="model"
                  placeholder="e.g. iPhone 15"
                  value={phone.model}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="update-field">
                <span>Condition</span>
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

              <label className="update-field">
                <span>Price (₹)</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  value={phone.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="update-field">
                <span>RAM</span>
                <input
                  name="ram"
                  placeholder="e.g. 8GB"
                  value={phone.ram}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="update-field">
                <span>Storage</span>
                <input
                  name="storage"
                  placeholder="e.g. 256GB"
                  value={phone.storage}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="update-field update-description-field">
              <span>Description</span>
              <textarea
                name="description"
                placeholder="Enter phone description..."
                value={phone.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </label>

            {errorMessage && (
              <div className="update-feedback update-error" role="alert">
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="update-feedback update-success" role="status">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            <div className="update-form-footer">
              <Link to="/" className="update-cancel-button">
                Cancel
              </Link>

              <button
                className="update-submit-button"
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle className="update-spinner" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
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

export default UpdatePhone;
