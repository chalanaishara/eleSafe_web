import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage/Tokens here if you have them
    // localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-info">
          <h2>My Profile</h2>
          <p>Manage your account settings.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>Logout</span> 
        </button>
      </div>

      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <div className="avatar">A</div>
          </div>
          <h3>Admin</h3>
          <span className="badge badge-profile">ADMINISTRATOR</span>
        </div>

        <div className="form-section">
          <div className="card">
            <div className="card-header">Personal Information</div>
            <div className="card-body personal-info-row">
              <div className="input-group">
                <label>Username</label>
                <input type="text" defaultValue="AdminUser" />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" defaultValue="admin@elesafe.lk" />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button className="save-changes-btn">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}