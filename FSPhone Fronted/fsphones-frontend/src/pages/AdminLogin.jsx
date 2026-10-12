
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { API_BASE_URL, getCsrfToken } from "../api";

import {
  ShieldCheck,
  LockKeyhole,
  UserRound,
  ArrowLeft,
  Smartphone,
  Eye,
  EyeOff
} from "lucide-react"

function AdminLogin() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

async function handleLogin(e) {
  e.preventDefault();

  if (loading) return;

  setMessage("");
  setLoading(true);

  try {
    let csrfHeaders = {};
    try {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        csrfHeaders["X-XSRF-TOKEN"] = csrfToken;
      }
    } catch (csrfErr) {
      console.warn("CSRF token fetch optional/skipped:", csrfErr);
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeaders,
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard");
    } else if (response.status === 401) {
      setMessage("Invalid username or password.");
    } else {
      let errorMsg = `Login failed (${response.status}). Please try again.`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch {
        const errorText = await response.text();
        if (errorText) errorMsg = errorText;
      }
      console.error("Login failed:", response.status, errorMsg);
      setMessage(errorMsg);
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage(error.message || "Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
}




  return (
    <main className="admin-login-page">
      <div className="admin-login-layout">
        <section className="login-welcome-panel">
          <div className="login-brand-mark">
            <Smartphone size={28} />
          </div>

          <span className="login-eyebrow">FSPHONES MANAGEMENT</span>

          <h1>
            Manage your
            <br />
            <span>phone store.</span>
          </h1>

          <p>
            Sign in to manage your phone catalogue, update product
            details, and keep your store information up to date.
          </p>

          <div className="login-security-note">
            <ShieldCheck size={20} />
            <span>Administrator access</span>
          </div>

          <div className="login-decoration login-decoration-one" />
          <div className="login-decoration login-decoration-two" />
        </section>

        <section className="login-form-panel">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} />
            Back to store
          </Link>

          <div className="login-form-heading">
            <div className="login-heading-icon">
              <LockKeyhole size={23} />
            </div>

            <h2>Welcome back</h2>
            <p>Enter your administrator credentials to continue.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleLogin}>
            <label htmlFor="admin-username">Username</label>

            <div className="login-input-wrap">
              <UserRound size={18} />
              <input
                id="admin-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="admin-password">Password</label>

            <div className="login-input-wrap">
              <LockKeyhole size={18} />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {message && (
              <div className="login-error" role="alert">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="login-footer-note">
            <ShieldCheck size={16} />
            <span>For authorised administrators only</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLogin
