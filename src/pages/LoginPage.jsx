// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm]             = useState({ email: "", password: "" });
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);

      // Only ADMIN and WILD_OFFICER can access this web portal
      if (!["ADMIN", "WILD_OFFICER"].includes(data.role)) {
        setError("Access denied. This portal is for Admin and Wild Officers only.");
        return;
      }

      // Wild Officers must be ACTIVE (not PENDING/SUSPENDED)
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
    <div className="login-container">
      <div className="login-header">
        <h1>EleSafe Lanka</h1>
      </div>

      <div className="login-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Staff portal — Admin & Wild Officers only.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>EMAIL</label>
          <div className="input-box">
            <FaUser />
            <input type="email" name="email" placeholder="your@email.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <label>PASSWORD</label>
          <div className="input-box">
            <FaLock />
            <input name="password" type={showPass ? "text" : "password"}
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
            <span className="eye" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p className="forgot">Forgot Password?</p>

          <button type="submit" className="login-btn" disabled={loading}>
            <FaSignInAlt /> {loading ? "Logging in..." : "LOG IN"}
          </button>
        </form>

        <p className="footer">
          Wild Officer?{" "}
          <span onClick={() => navigate("/register")}>Register Here</span>
        </p>
      </div>
    </div>
  );
}
