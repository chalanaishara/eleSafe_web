// src/components/Sidebar.jsx
export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <h2>🐘 EleSafe Lanka</h2>
      <div className="main-nav">
        <div 
          className={`sidebar-row ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          {/* Replace with actual icons */}
          <span>[👥]</span> 
          <span>Village Users</span>
        </div>
        <div 
          className={`sidebar-row ${activeTab === "officers" ? "active" : ""}`}
          onClick={() => setActiveTab("officers")}
        >
          {/* Replace with actual icons */}
          <span>[🛡️]</span> 
          <span>Wild Officers</span>
        </div>
      </div>

      <div className="profile-nav">
        <div 
          className={`sidebar-profile ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="initials-avatar">AD</div>
          <div className="profile-info">
            <span className="profile-name">Admin User</span>
            <span className="profile-subtitle">View Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}