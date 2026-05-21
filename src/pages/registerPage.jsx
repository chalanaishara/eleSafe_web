// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import "../styles/register.css";

const GENDERS = ["MALE", "FEMALE", "OTHER"];

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", nic: "", email: "",
    phoneNumber: "", password: "", confirmPassword: "",
    gender: "MALE", address: "", village: "", district: "",
    badgeNumber: "", station: "",
  });
  const [error,   setError]   = useState("");
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
    setLoading(true);
    try {
      await register({
        firstName:   form.firstName,
        lastName:    form.lastName,
        nic:         form.nic,
        email:       form.email,
        phoneNumber: form.phoneNumber,
        password:    form.password,
        gender:      form.gender,
        address:     form.address,
        village:     form.village,
        district:    form.district,
        badgeNumber: form.badgeNumber,
        station:     form.station,
        role:        "WILD_OFFICER",
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
      <div className="register-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Registration Submitted</h2>
          <p>Your Wild Officer account is <strong>pending admin approval</strong>.</p>
          <p>You will be able to log in once an administrator activates your account.</p>
          <button className="login-redirect-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>🐘 EleSafe Lanka</h1>
          <h2>Wild Officer Registration</h2>
          <p>Your account will be reviewed and activated by an administrator.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="input-group">
              <label>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={set} required placeholder="Kamal" />
            </div>
            <div className="input-group">
              <label>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={set} required placeholder="Perera" />
            </div>
            <div className="input-group">
              <label>NIC *</label>
              <input name="nic" value={form.nic} onChange={set} required placeholder="200012345678" />
            </div>
            <div className="input-group">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={set}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group full">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={set} required placeholder="officer@wildlife.gov" />
            </div>
            <div className="input-group">
              <label>Phone Number *</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={set} required placeholder="0771234567" maxLength={10} />
            </div>
            <div className="input-group">
              <label>Village</label>
              <input name="village" value={form.village} onChange={set} placeholder="Yala" />
            </div>
            <div className="input-group full">
              <label>Address</label>
              <input name="address" value={form.address} onChange={set} placeholder="Ranger Quarter 4, Yala" />
            </div>

            <div className="section-title full">🛡️ Officer Details</div>

            <div className="input-group">
              <label>Badge Number *</label>
              <input name="badgeNumber" value={form.badgeNumber} onChange={set} required placeholder="WP-5022" />
            </div>
            <div className="input-group">
              <label>Station *</label>
              <input name="station" value={form.station} onChange={set} required placeholder="Yala Station" />
            </div>

            {/* ✅ District dropdown inside Officer Details — maps to backend district field */}
            <div className="input-group">
              <label>Office Area District *</label>
              <select name="district" value={form.district} onChange={set} required>
                <option value="" disabled>Select District</option>
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="section-title full">🔒 Password</div>

            <div className="input-group">
              <label>Password *</label>
              <input type="password" name="password" value={form.password} onChange={set} required placeholder="••••••••" />
            </div>
            <div className="input-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={set} required placeholder="••••••••" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="back-btn" onClick={() => navigate("/")}>Back to Login</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
