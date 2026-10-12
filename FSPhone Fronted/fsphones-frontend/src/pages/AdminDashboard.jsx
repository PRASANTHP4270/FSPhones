
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



import {
  API_BASE_URL,
  getCsrfToken,
  checkAdminSession,
  getAuthHeaders,
} from "../api";

import {
  Smartphone,
  Plus,
  Store,
  LogOut,
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
  let cancelled = false;

  async function verifySession() {
    try {
      const authenticated = await checkAdminSession();

      if (cancelled) return;

      if (authenticated) {
        setIsLoggedIn(true);
      } else {
        sessionStorage.removeItem("adminLoggedIn");
        sessionStorage.removeItem("adminToken");
        navigate("/admin-login", { replace: true });
      }
    } catch {
      if (!cancelled) {
        sessionStorage.removeItem("adminLoggedIn");
        sessionStorage.removeItem("adminToken");
        navigate("/admin-login", { replace: true });
      }
    }
  }

  verifySession();

  return () => {
    cancelled = true;
  };
}, [navigate]);

async function logout() {
  try {
    const csrfToken = await getCsrfToken();
    const headers = {
      ...getAuthHeaders(),
    };
    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
    }

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers,
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminToken");
    navigate("/admin-login", { replace: true });
  }
}

  if (!isLoggedIn) {
    return (
      <main className="admin-dashboard-loading">
        <div className="dashboard-loader" />
        <p>Checking admin login...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <span className="dashboard-eyebrow">
              <ShieldCheck size={16} />
              ADMIN CONTROL PANEL
            </span>

            <h1>
              Welcome to <span>FSPhones</span>
            </h1>

            <p>
              Manage your phone listings and keep your store up to date.
            </p>
          </div>

          <div className="dashboard-hero-icon">
            <Smartphone size={64} strokeWidth={1.4} />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-label">YOUR WORKSPACE</span>
              <h2>Dashboard</h2>
              <p>Choose an action to manage your store.</p>
            </div>

            <div className="dashboard-status">
              <span className="dashboard-status-dot" />
              Admin session active
            </div>
          </div>

          <div className="dashboard-actions">
            <Link
              to="/admin/add-phone"
              className="dashboard-action-card dashboard-add-card"
            >
              <div className="dashboard-action-icon">
                <Plus size={26} />
              </div>

              <span className="dashboard-card-label">PHONE INVENTORY</span>
              <h3>Add a Phone</h3>
              <p>
                Add a new or used phone with its price, specifications, and
                image.
              </p>

              <span className="dashboard-card-link">
                Add phone <ArrowRight size={17} />
              </span>
            </Link>

            <Link
              to="/"
              className="dashboard-action-card dashboard-view-card"
            >
              <div className="dashboard-action-icon">
                <Store size={26} />
              </div>

              <span className="dashboard-card-label">STORE CATALOG</span>
              <h3>View Phones</h3>
              <p>
                Browse your store and check the phone listings visible to
                customers.
              </p>

              <span className="dashboard-card-link">
                Open store <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </section>

        <section className="dashboard-bottom-bar">
          <div className="dashboard-bottom-info">
            <div className="dashboard-bottom-icon">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <strong>FSPhones Management</strong>
              <p>Manage your store from one place.</p>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
