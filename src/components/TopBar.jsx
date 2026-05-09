// src/components/TopBar.jsx
const TAB_TITLES = {
  users:    "Village Users Management",
  officers: "Wild Officers Management",
  reports:  "Reports Dashboard",
};

export default function TopBar({ searchTerm, setSearchTerm, activeTab }) {
  return (
    <div className="topbar">
      <h3>{TAB_TITLES[activeTab] || "Dashboard"}</h3>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
