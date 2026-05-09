// src/components/UsersTable.jsx
// ADMIN ONLY — shows all village users (role=USER), allows activate/suspend
import { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus } from "../services/api";
import UserDetailsModal from "./UserDetailsModal";

export default function UsersTable({ searchTerm }) {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [selected,   setSelected]   = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((all) => setUsers(all.filter((u) => u.role === "USER")))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (userId, current, e) => {
    e.stopPropagation();
    const next = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setTogglingId(userId);
    try {
      await updateUserStatus(userId, next);
      setUsers((prev) => prev.map((u) => u.userId === userId ? { ...u, status: next } : u));
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = users.filter((u) =>
    [u.firstName, u.lastName, u.village, u.userId, u.email]
      .some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading-state">Loading users...</div>;
  if (error)   return <div className="error-state">⚠ {error}</div>;

  return (
    <>
      <div className="table-header-row">
        <span className="table-count">{filtered.length} village users</span>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User ID</th><th>Name</th><th>Village</th>
              <th>Email</th><th>Phone</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-cell">No users found</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.userId} className="clickable-row" onClick={() => setSelected(u)}>
                <td>{u.userId}</td>
                <td><strong>{u.firstName} {u.lastName}</strong></td>
                <td>{u.village || "—"}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber || "—"}</td>
                <td><span className={`badge ${u.status?.toLowerCase()}`}>{u.status}</span></td>
                <td>
                  <button
                    className={`action-btn ${u.status === "ACTIVE" ? "btn-suspend" : "btn-activate"}`}
                    onClick={(e) => toggleStatus(u.userId, u.status, e)}
                    disabled={togglingId === u.userId}
                  >
                    {togglingId === u.userId ? "..." : u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserDetailsModal data={selected} onClose={() => setSelected(null)} />
    </>
  );
}
