// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const ROLES = [
  { key: "Admin", label: "Admin" },
  { key: "Technician", label: "Technician" },
  { key: "Receptionist", label: "Receptionist" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          role: role, // Send the selected role for verification
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login error:", data);
        setError(data.message || "Sign-in failed. Check your details and try again.");
        return;
      }

      // Update AuthContext
      login(data);

      // Navigate based on returned DB user role
      const dbRole = data.user?.role || role;
      const normalizedRole = dbRole.charAt(0).toUpperCase() + dbRole.slice(1).toLowerCase();

      const destinations = {
        Admin: "/admin/dashboard",
        Technician: "/technician/dashboard",
        Receptionist: "/receptionist/dashboard",
      };

      navigate(destinations[normalizedRole] || "/", { replace: true });
    } catch (err) {
      console.error("Network error:", err);
      setError("Can't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cdx-screen">
      <div className="cdx-panel-brand">
        <div className="cdx-brand-mark">
          <span className="cdx-brand-dot" />
          CareDx
        </div>

        <div className="cdx-vitals" aria-hidden="true">
          <svg viewBox="0 0 400 120" className="cdx-vitals-svg">
            <polyline
              className="cdx-vitals-line"
              fill="none"
              strokeWidth="2.5"
              points="0,60 60,60 80,60 95,20 110,100 125,40 140,60 400,60"
            />
          </svg>
        </div>

        <div className="cdx-brand-copy">
          <h1>Diagnostics, coordinated.</h1>
          <p>
            One portal for the front desk, the lab bench, and the people
            running the clinic — built around the record, not the role.
          </p>
        </div>

        <ul className="cdx-brand-list">
          <li>Patient records synced in real time</li>
          <li>Role-scoped access, audited by default</li>
          <li>Reports out the door faster</li>
        </ul>
      </div>

      <div className="cdx-panel-form">
        <form className="cdx-card" onSubmit={handleSubmit} noValidate>
          <p className="cdx-eyebrow">Sign in</p>
          <h2 className="cdx-title">Welcome back</h2>
          <p className="cdx-subtitle">Choose your role and sign in with your work email.</p>

          <div className="cdx-role-tabs" role="tablist" aria-label="Select your role">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.key}
                role="tab"
                aria-selected={role === r.key}
                className={`cdx-role-tab ${role === r.key ? "is-active" : ""}`}
                onClick={() => setRole(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <label className="cdx-field">
            <span className="cdx-field-label">Email address</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@caredx.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="cdx-field">
            <span className="cdx-field-label">Password</span>
            <div className="cdx-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="cdx-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && (
            <div className="cdx-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="cdx-submit" disabled={loading}>
            {loading ? "Signing in…" : `Sign in as ${role}`}
          </button>

          <a className="cdx-forgot" href="/forgot-password">
            Forgot your password?
          </a>
        </form>
      </div>
    </div>
  );
}