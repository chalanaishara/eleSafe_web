// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaLeaf } from "react-icons/fa";
import { login } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);

      if (!["ADMIN", "WILD_OFFICER"].includes(data.role)) {
        setError("Access denied. This portal is for Admin and Wild Officers only.");
        return;
      }

      if (data.role === "WILD_OFFICER" && data.status !== "ACTIVE") {
        setError(
          data.status === "PENDING"
            ? "Your account is pending admin approval. Please wait."
            : "Your account has been suspended. Contact admin."
        );
        return;
      }

      signIn(data);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/officer");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <div className="brand-overlay" />
          <div className="brand-content">
            <img src="/icon.png" alt="EleSafe" className="brand-logo" />
            <h1>EleSafe Lanka</h1>
            <p className="brand-tagline">Wildlife Alert &amp; Safety Portal for staff and officers.</p>
            <div className="brand-features">
              <span><FaLeaf /> Live sighting reports</span>
              <span><FaLeaf /> Officer duty dashboard</span>
              <span><FaLeaf /> Community safety alerts</span>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to the staff portal — Admin &amp; Wild Officers only.</p>

            {error && <div className="auth-error" role="alert">{error}</div>}

            <form onSubmit={handleLogin} noValidate>
              <label className="auth-label" htmlFor="email">Email</label>
              <div className="auth-input-box">
                <FaUser className="auth-input-icon" aria-hidden />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="officer@wildlife.gov"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-box">
                <FaLock className="auth-input-icon" aria-hidden />
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                <FaSignInAlt />
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="auth-footer">
              Wild Officer?{" "}
              <button type="button" className="auth-link-btn" onClick={() => navigate("/register")}>
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
