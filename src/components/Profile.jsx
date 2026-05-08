export default function Profile() {
  return (
    <div className="profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button className="logout">Logout</button>
      </div>

      <div className="profile-body">
        <div className="left">
          <div className="avatar"></div>
          <h3>Admin</h3>
          <span className="badge">ADMINISTRATOR</span>
        </div>

        <div className="right">
          <div className="card">
            <h4>Personal Information</h4>
            <input placeholder="Username" />
            <input placeholder="Email Address" />
          </div>

          <div className="card">
            <h4>Identity Verification</h4>
            <input placeholder="Enter NIC" />
            <div className="row">
              <input placeholder="Birthday" />
              <input placeholder="Age" />
              <input placeholder="Gender" />
            </div>
          </div>

          <button className="save">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
