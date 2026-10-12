
import { Link } from "react-router-dom"

import { API_BASE_URL, getCsrfToken, getAuthHeaders } from "../api";

function PhoneCard({ phone }) {
  const isAdminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true"

async function deletePhone() {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this phone?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    let csrfToken = null;
    try {
      csrfToken = await getCsrfToken();
    } catch {
      // CSRF token is optional when token authentication is used
    }

    const headers = {
      ...getAuthHeaders(),
    };
    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
    }

    const response = await fetch(
      `${API_BASE_URL}/phones/${phone.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (response.ok) {
      alert("Phone deleted successfully");
      window.location.reload();
    } else {
      alert("Failed to delete phone");
    }
  } catch (error) {
    console.error("Delete phone error:", error);
    alert("Server connection failed");
  }
}

  return (
    <div className="phone-card">
      <img
        src={phone.imageUrl}
        alt={`${phone.brand} ${phone.model}`}
      />

      <h2>{phone.brand} {phone.model}</h2>
      <p>Condition: {phone.condition}</p>
      <p>RAM: {phone.ram}</p>
      <p>Storage: {phone.storage}</p>
      <p>Price: ₹{phone.price}</p>

      <Link to={`/phones/${phone.id}`}>
        <button>View Details</button>
      </Link>

      {isAdminLoggedIn && (
        <>
          <Link to={`/admin/update-phone/${phone.id}`}>
            <button>Update</button>
          </Link>

          <button onClick={deletePhone}>
            Delete
          </button>
        </>
      )}
    </div>
  )
}

export default PhoneCard
