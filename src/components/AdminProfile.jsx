// src/components/AdminProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

function InfoField({ label, value }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type="text" value={value || "—"} readOnly
        style={{ paddingLeft: 12, cursor: "default", backgroundColor: "#f8fafc" }} />
    </div>
  );
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile().then(setAdmin).catch(console.warn).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { signOut(); navigate("/"); };

  if (loading) return <div className="loading-state">Loading profile...</div>;
  if (!admin)  return <div className="error-state">Could not load profile.</div>;

  const initials = `${admin.firstName?.[0] || "A"}${admin.lastName?.[0] || "D"}`.toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-info">
          <h2>My Profile</h2>
          <p>Administrator account details.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {admin.profilePicture
              ? <img src={admin.profilePicture} alt="Avatar"
                  style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover" }} />
              : <div className="avatar">{initials}</div>}
          </div>
          <h3>{admin.firstName} {admin.lastName}</h3>
          <span className="badge badge-profile">ADMINISTRATOR</span>
        </div>

        <div className="form-section">
          <div className="card">
            <div className="card-header">Account Information</div>
            <div className="personal-info-row">
              <InfoField label="First Name"   value={admin.firstName} />
              <InfoField label="Last Name"    value={admin.lastName} />
              <InfoField label="Email"        value={admin.email} />
              <InfoField label="Phone"        value={admin.phoneNumber} />
              <InfoField label="NIC"          value={admin.nic} />
              <InfoField label="Village"      value={admin.village} />
              <InfoField label="Status"       value={admin.status} />
              <InfoField label="Role"         value={admin.role} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
