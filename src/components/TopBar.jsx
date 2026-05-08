export default function TopBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="topbar">
      <h3>Management Dashboard</h3>
      <input 
        type="text" 
        placeholder="Search by name, village, or ID..." 
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}