
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fsphones-backend.onrender.com";

export async function checkAdminSession() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.authenticated === true;
}
