
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { API_BASE_URL } from "../api";

import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  HardDrive,
  Cpu,
  Tag,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

function PhoneDetails() {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPhone() {
      setLoading(true);
      setError("");
      setPhone(null);
      setImageFailed(false);

      try {
        
          const response = await fetch(
           `${API_BASE_URL}/phones/${id}`,
           { signal: controller.signal }
              );


        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Phone not found."
              : "Unable to load phone details."
          );
        }

        const data = await response.json();
        setPhone(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Phone details error:", err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPhone();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="phone-details details-state">
        <LoaderCircle className="details-spinner" size={32} />
        <p>Loading phone details...</p>
      </main>
    );
  }

  if (error || !phone) {
    return (
      <main className="phone-details details-state">
        <div className="details-message-icon">
          <AlertCircle size={30} />
        </div>
        <h2>{error || "Phone not found."}</h2>
        <p>We couldn't display this phone. Return to the store to browse other devices.</p>
        <Link to="/" className="details-back-link">
          <ArrowLeft size={17} />
          Back to Phones
        </Link>
      </main>
    );
  }

  const isNew = phone.condition?.toUpperCase() === "NEW";

  return (
    <main className="phone-details">
      <Link to="/" className="details-back-link">
        <ArrowLeft size={17} />
        Back to Phones
      </Link>

      <div className="details-page-heading">
        <span className="details-eyebrow">FSPHONES / PRODUCT DETAILS</span>
        <h1>Discover your next phone.</h1>
        <p>Explore the features and specifications of this device.</p>
      </div>

      <section className="details-card">
        <div className="details-image-panel">
          <span
            className={`details-condition ${
              isNew ? "condition-new" : "condition-used"
            }`}
          >
            {phone.condition || "Condition not specified"}
          </span>

          {phone.imageUrl && !imageFailed ? (
            <img
              src={phone.imageUrl}
              alt={`${phone.brand || ""} ${phone.model || ""}`.trim()}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="details-image-fallback">
              <Smartphone size={80} strokeWidth={1.2} />
              <span>Image unavailable</span>
            </div>
          )}
        </div>

        <div className="details-info">
          <span className="details-brand">{phone.brand || "Phone"}</span>
          <h2>{phone.model || "Model not specified"}</h2>

          <div className="details-price">
            ₹{Number(phone.price ?? 0).toLocaleString("en-IN")}
          </div>

          <p className="details-description">
            {phone.description ||
              "No description is available for this phone yet."}
          </p>

          <div className="details-divider" />

          <h3 className="specifications-heading">
            Product specifications
          </h3>

          <div className="specifications-grid">
            <div className="specification-item">
              <span className="specification-icon">
                <Cpu size={19} />
              </span>
              <div>
                <span>RAM</span>
                <strong>{phone.ram || "Not specified"}</strong>
              </div>
            </div>

            <div className="specification-item">
              <span className="specification-icon">
                <HardDrive size={19} />
              </span>
              <div>
                <span>Storage</span>
                <strong>{phone.storage || "Not specified"}</strong>
              </div>
            </div>

            <div className="specification-item">
              <span className="specification-icon">
                <Tag size={19} />
              </span>
              <div>
                <span>Condition</span>
                <strong>{phone.condition || "Not specified"}</strong>
              </div>
            </div>

            <div className="specification-item">
              <span className="specification-icon">
                <ShieldCheck size={19} />
              </span>
              <div>
                <span>Store</span>
                <strong>FSPhones</strong>
              </div>
            </div>
          </div>

          <div className="details-note">
            <ShieldCheck size={18} />
            <span>Review the phone details carefully before purchasing.</span>
          </div>

          <Link to="/" className="details-browse-button">
            <RefreshCw size={17} />
            Browse More Phones
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PhoneDetails;
