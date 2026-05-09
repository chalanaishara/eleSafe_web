// src/components/Sidebar.jsx
import { FaUsers, FaShieldAlt, FaFileAlt, FaClipboardList } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ADMIN_TABS = [
  { id: "users",    label: "Village Users",  icon: <FaUsers /> },
  { id: "officers", label: "Wild Officers",  icon: <FaShieldAlt /> },
  { id: "reports",  label: "All Reports",    icon: <FaFileAlt /> },
];

const OFFICER_TABS = [
  { id: "reports",  label: "Reports",        icon: <FaClipboardList /> },
];

export default function Sidebar({ activeTab, setActiveTab, role }) {
  const { user } = useAuth();
  const tabs = role === "ADMIN" ? ADMIN_TABS : OFFICER_TABS;
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "??";

  return (
    <div className="sidebar">
      <h2>🐘 EleSafe Lanka</h2>

      <div className="main-nav">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`sidebar-row ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </div>
        ))}
      </div>

      <div className="profile-nav">
        <div
          className={`sidebar-profile ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="initials-avatar">{initials}</div>
          <div className="profile-info">
            <span className="profile-name">{user?.firstName} {user?.lastName}</span>
            <span className="profile-subtitle">
              {role === "ADMIN" ? "Administrator" : "Wild Officer"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
