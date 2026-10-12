
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fsphones-backend.onrender.com";

export function getAuthHeaders() {
  const token = sessionStorage.getItem("adminToken");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["X-Session-Id"] = token;
  }
  return headers;
}

export async function getCsrfToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.token || null;
  } catch (err) {
    console.warn("CSRF token fetch optional/skipped:", err);
    return null;
  }
}

export async function checkAdminSession() {
  const token = sessionStorage.getItem("adminToken");
  const loggedIn = sessionStorage.getItem("adminLoggedIn");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.authenticated === true;
  } catch (err) {
    console.error("Session verification error:", err);
    if (loggedIn === "true" && token) {
      return true;
    }
    return false;
  }
}
