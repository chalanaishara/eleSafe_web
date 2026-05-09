// src/components/OfficerProfile.jsx
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

export default function OfficerProfile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile().then(setProfile).catch(console.warn).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { signOut(); navigate("/"); };

  if (loading) return <div className="loading-state">Loading profile...</div>;
  if (!profile) return <div className="error-state">Could not load profile.</div>;

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-info">
          <h2>My Profile</h2>
          <p>Wild Officer account details.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt="Avatar"
                  style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover" }} />
              : <div className="avatar">{initials}</div>}
          </div>
          <h3>{profile.firstName} {profile.lastName}</h3>
          <span className="badge badge-officer">WILD OFFICER</span>
        </div>

        <div className="form-section">
          <div className="card">
            <div className="card-header">Personal Information</div>
            <div className="personal-info-row">
              <InfoField label="First Name"   value={profile.firstName} />
              <InfoField label="Last Name"    value={profile.lastName} />
              <InfoField label="Email"        value={profile.email} />
              <InfoField label="Phone"        value={profile.phoneNumber} />
              <InfoField label="NIC"          value={profile.nic} />
              <InfoField label="Village"      value={profile.village} />
            </div>
          </div>
          <div className="card">
            <div className="card-header">🛡️ Officer Details</div>
            <div className="personal-info-row">
              <InfoField label="Badge Number" value={profile.badgeNumber} />
              <InfoField label="Station"      value={profile.station} />
              <InfoField label="Status"       value={profile.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
