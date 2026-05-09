// src/components/OfficersTable.jsx
// ADMIN ONLY — shows all wild officers, allows activate (from PENDING) / suspend
import { useState, useEffect } from "react";
import { getAllOfficers, updateUserStatus } from "../services/api";
import UserDetailsModal from "./UserDetailsModal";

const STATUS_ACTIONS = {
  ACTIVE:   { label: "Suspend",  next: "SUSPENDED", cls: "btn-suspend" },
  SUSPENDED:{ label: "Activate", next: "ACTIVE",    cls: "btn-activate" },
  PENDING:  { label: "Approve",  next: "ACTIVE",    cls: "btn-approve" },
};

export default function OfficersTable({ searchTerm }) {
  const [officers,   setOfficers]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [selected,   setSelected]   = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    getAllOfficers()
      .then(setOfficers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (userId, current, e) => {
    e.stopPropagation();
    const action = STATUS_ACTIONS[current];
    if (!action) return;
    setTogglingId(userId);
    try {
      await updateUserStatus(userId, action.next);
      setOfficers((prev) =>
        prev.map((o) => o.userId === userId ? { ...o, status: action.next } : o)
      );
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = officers.filter((o) =>
    [o.firstName, o.lastName, o.village, o.userId, o.badgeNumber, o.station]
      .some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = officers.filter((o) => o.status === "PENDING").length;

  if (loading) return <div className="loading-state">Loading officers...</div>;
  if (error)   return <div className="error-state">⚠ {error}</div>;

  return (
    <>
      <div className="table-header-row">
        <span className="table-count">{filtered.length} wild officers</span>
        {pendingCount > 0 && (
          <span className="pending-badge">⏳ {pendingCount} pending approval</span>
        )}
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User ID</th><th>Name</th><th>Badge</th>
              <th>Station</th><th>Village</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-cell">No officers found</td></tr>
            ) : filtered.map((o) => {
              const action = STATUS_ACTIONS[o.status];
              return (
                <tr key={o.userId} className="clickable-row" onClick={() => setSelected(o)}>
                  <td>{o.userId}</td>
                  <td><strong>{o.firstName} {o.lastName}</strong></td>
                  <td>{o.badgeNumber || "—"}</td>
                  <td>{o.station || "—"}</td>
                  <td>{o.village || "—"}</td>
                  <td><span className={`badge ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                  <td>
                    {action && (
                      <button
                        className={`action-btn ${action.cls}`}
                        onClick={(e) => changeStatus(o.userId, o.status, e)}
                        disabled={togglingId === o.userId}
                      >
                        {togglingId === o.userId ? "..." : action.label}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <UserDetailsModal data={selected} onClose={() => setSelected(null)} />
    </>
  );
}
