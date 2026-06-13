// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt,
  FaShieldAlt, FaLock, FaLeaf, FaCheckCircle,
} from "react-icons/fa";
import { register } from "../services/api";
import "../styles/auth.css";

const GENDERS = ["MALE", "FEMALE", "OTHER"];

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

function Field({ label, name, value, onChange, type = "text", placeholder, required, maxLength, full, icon: Icon }) {
  return (
    <div className={full ? "full" : undefined}>
      <label className="auth-label" htmlFor={name}>{label}</label>
      <div className="auth-input-box">
        {Icon && <Icon className="auth-input-icon" aria-hidden />}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", nic: "", email: "",
    phoneNumber: "", password: "", confirmPassword: "",
    gender: "MALE", address: "", village: "", district: "",
    badgeNumber: "", station: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.district) {
      setError("Please select your office district.");
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        nic: form.nic,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        gender: form.gender,
        address: form.address,
        village: form.village,
        district: form.district,
        badgeNumber: form.badgeNumber,
        station: form.station,
        role: "WILD_OFFICER",
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-success-wrap">
        <div className="auth-success-card">
          <div className="auth-success-icon"><FaCheckCircle /></div>
          <h2>Registration Submitted</h2>
          <p>Your Wild Officer account is <strong>pending admin approval</strong>.</p>
          <p>You can sign in once an administrator activates your account.</p>
          <button type="button" className="auth-btn-primary" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-shell auth-shell--wide">
        <div className="auth-brand auth-brand--short">
          <div className="brand-overlay" />
          <div className="brand-content">
            <img src="/icon.png" alt="EleSafe" className="brand-logo" />
            <h1>EleSafe Lanka</h1>
            <p className="brand-tagline">Join the wildlife protection team. Register as a Wild Officer.</p>
            <div className="brand-features">
              <span><FaLeaf /> Admin-reviewed accounts</span>
              <span><FaLeaf /> District-based duty reports</span>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner" style={{ maxWidth: "100%" }}>
            <h2>Officer Registration</h2>
            <p className="auth-subtitle">Complete the form below. Your account will be reviewed by an administrator.</p>

            {error && <div className="auth-error" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form-grid" noValidate>
              <Field label="First Name *" name="firstName" value={form.firstName} onChange={set} placeholder="Kamal" required icon={FaUser} />
              <Field label="Last Name *" name="lastName" value={form.lastName} onChange={set} placeholder="Perera" required icon={FaUser} />
              <Field label="NIC *" name="nic" value={form.nic} onChange={set} placeholder="200012345678" required icon={FaIdCard} />
              <div>
                <label className="auth-label" htmlFor="gender">Gender *</label>
                <div className="auth-input-box">
                  <FaUser className="auth-input-icon" aria-hidden />
                  <select id="gender" name="gender" value={form.gender} onChange={set}>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="full">
                <Field label="Email *" name="email" type="email" value={form.email} onChange={set} placeholder="officer@wildlife.gov" required icon={FaEnvelope} full />
              </div>
              <Field label="Phone *" name="phoneNumber" value={form.phoneNumber} onChange={set} placeholder="0771234567" required maxLength={10} icon={FaPhone} />
              <Field label="Village" name="village" value={form.village} onChange={set} placeholder="Yala" icon={FaMapMarkerAlt} />

              <div className="full">
                <Field label="Address" name="address" value={form.address} onChange={set} placeholder="Ranger Quarter 4, Yala" icon={FaMapMarkerAlt} full />
              </div>

              <div className="auth-section-title">Officer Details</div>
              <Field label="Badge Number *" name="badgeNumber" value={form.badgeNumber} onChange={set} placeholder="WP-5022" required icon={FaShieldAlt} />
              <Field label="Station *" name="station" value={form.station} onChange={set} placeholder="Yala Station" required icon={FaMapMarkerAlt} />

              <div>
                <label className="auth-label" htmlFor="district">Office District *</label>
                <div className="auth-input-box">
                  <FaMapMarkerAlt className="auth-input-icon" aria-hidden />
                  <select id="district" name="district" value={form.district} onChange={set} required>
                    <option value="" disabled>Select District</option>
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-section-title">Password</div>
              <Field label="Password *" name="password" type="password" value={form.password} onChange={set} placeholder="••••••••" required icon={FaLock} />
              <Field label="Confirm Password *" name="confirmPassword" type="password" value={form.confirmPassword} onChange={set} placeholder="••••••••" required icon={FaLock} />

              <div className="auth-form-actions full">
                <button type="button" className="auth-btn-secondary" onClick={() => navigate("/")}>
                  Back to Login
                </button>
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? "Submitting…" : "Submit Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
