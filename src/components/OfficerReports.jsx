// src/components/OfficerReports.jsx
// WILD OFFICER — view recent reports, update damage report status
import { useState, useEffect } from "react";
import { getRecentReports, updateDamageStatus } from "../services/api";

const DAMAGE_STATUSES = ["PENDING", "IN_PROGRESS", "RESOLVED"];

function formatDate(raw) {
  if (!raw) return "—";
  if (Array.isArray(raw)) {
    const [y, mo, d, h = 0, m = 0] = raw;
    return new Date(y, mo - 1, d, h, m).toLocaleString();
  }
  return new Date(raw).toLocaleString();
}

const BEHAVIOR_COLORS = { AGGRESSIVE: "#ef4444", MOVING: "#f97316", CALM: "#22c55e", FEEDING: "#3b82f6" };

export default function OfficerReports({ searchTerm }) {
  const [reports,    setReports]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [selected,   setSelected]   = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [tab,        setTab]        = useState("sighting"); // "sighting" | "damage"

  useEffect(() => {
    getRecentReports()
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const isSighting = (r) => r.numberOfElephants != null;
  const isDamage   = (r) => !isSighting(r);

  const visible = reports
    .filter(tab === "sighting" ? isSighting : isDamage)
    .filter((r) =>
      [r.reportId, r.reporterId, r.village, r.district]
        .some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleStatusChange = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      await updateDamageStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => r.reportId === reportId ? { ...r, status: newStatus } : r)
      );
      if (selected?.reportId === reportId) setSelected((s) => ({ ...s, status: newStatus }));
    } catch (err) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="loading-state">Loading reports...</div>;
  if (error)   return <div className="error-state">⚠ {error}</div>;

  const sightingCount = reports.filter(isSighting).length;
  const damageCount   = reports.filter(isDamage).length;

  return (
    <>
      {/* Tab switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${tab === "sighting" ? "active" : ""}`}
          onClick={() => setTab("sighting")}
        >
          🐘 Sighting Reports <span className="tab-count">{sightingCount}</span>
        </button>
        <button
          className={`tab-btn ${tab === "damage" ? "active" : ""}`}
          onClick={() => setTab("damage")}
        >
          🔨 Damage Reports <span className="tab-count">{damageCount}</span>
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Report ID</th><th>Reporter</th><th>Location</th>
              <th>Details</th><th>Date</th><th>Status</th>
              {tab === "damage" && <th>Update Status</th>}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7} className="empty-cell">No reports found</td></tr>
            ) : visible.map((r) => (
              <tr key={r.reportId} className="clickable-row" onClick={() => setSelected(r)}>
                <td><code>{r.reportId}</code></td>
                <td style={{ fontSize: "0.85rem" }}>{r.reporterId}</td>
                <td>{r.village}, {r.district}</td>
                <td>
                  {isSighting(r) ? (
                    <span>
                      {r.numberOfElephants} 🐘 —{" "}
                      <span style={{ color: BEHAVIOR_COLORS[r.behavior], fontWeight: 600 }}>{r.behavior}</span>
                    </span>
                  ) : (
                    <span>{r.damageType || r.description?.slice(0, 40)}</span>
                  )}
                </td>
                <td style={{ fontSize: "0.85rem" }}>{formatDate(r.dateTime)}</td>
                <td>
                  <span className={`badge ${r.status?.toLowerCase() || "active"}`}>
                    {r.status || "Reported"}
                  </span>
                </td>
                {tab === "damage" && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="status-select"
                      value={r.status || "PENDING"}
                      onChange={(e) => handleStatusChange(r.reportId, e.target.value)}
                      disabled={updatingId === r.reportId}
                    >
                      {DAMAGE_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            <h2 style={{ marginTop: 0 }}>
              {isSighting(selected) ? "🐘 Sighting" : "🔨 Damage"} — {selected.reportId}
            </h2>
            <div className="modal-body">
              {[
                { label: "Reporter",    value: selected.reporterId },
                { label: "District",    value: selected.district },
                { label: "Village",     value: selected.village },
                { label: "Date",        value: formatDate(selected.dateTime) },
                { label: "Elephants",   value: selected.numberOfElephants },
                { label: "Behavior",    value: selected.behavior },
                { label: "Damage Type", value: selected.damageType },
                { label: "Notes",       value: selected.description || selected.additionalNotes },
                { label: "Status",      value: selected.status },
              ].filter((r) => r.value != null).map((r) => (
                <div className="detail-row" key={r.label}>
                  <span className="detail-label">{r.label}</span>
                  <span className="detail-value">{String(r.value)}</span>
                </div>
              ))}
            </div>
            {selected.imagePath && (
              <img src={selected.imagePath} alt="Evidence"
                style={{ width: "100%", borderRadius: 10, marginTop: 12, maxHeight: 600, objectFit: "cover" }} />
            )}
            {isDamage(selected) && (
              <div style={{ marginTop: 16 }}>
                <label className="detail-label">Update Status</label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {DAMAGE_STATUSES.map((s) => (
                    <button
                      key={s}
                      className={`action-btn ${selected.status === s ? "btn-activate" : ""}`}
                      style={{ flex: 1, opacity: updatingId === selected.reportId ? 0.6 : 1 }}
                      onClick={() => handleStatusChange(selected.reportId, s)}
                      disabled={updatingId === selected.reportId}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
