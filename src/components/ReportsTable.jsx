// src/components/ReportsTable.jsx
// ADMIN ONLY — view all sighting & damage reports
import { useState, useEffect } from "react";
import { getRecentReports } from "../services/api";

function formatDate(raw) {
  if (!raw) return "—";
  if (Array.isArray(raw)) {
    const [y, mo, d, h = 0, m = 0] = raw;
    return new Date(y, mo - 1, d, h, m).toLocaleString();
  }
  return new Date(raw).toLocaleString();
}

const TYPE_LABELS = { SightingReport: "🐘 Sighting", DamageReport: "🔨 Damage" };
const BEHAVIOR_COLORS = { AGGRESSIVE: "#ef4444", MOVING: "#f97316", CALM: "#22c55e", FEEDING: "#3b82f6" };

export default function ReportsTable({ searchTerm }) {
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getRecentReports()
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) =>
    [r.reportId, r.reporterId, r.village, r.district]
      .some((v) => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading-state">Loading reports...</div>;
  if (error)   return <div className="error-state">⚠ {error}</div>;

  return (
    <>
      <div className="table-header-row">
        <span className="table-count">{filtered.length} reports</span>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Report ID</th><th>Type</th><th>Reporter</th>
              <th>Location</th><th>Details</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-cell">No reports found</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.reportId} className="clickable-row" onClick={() => setSelected(r)}>
                <td><code>{r.reportId}</code></td>
                <td>{TYPE_LABELS[r._class] || (r.numberOfElephants != null ? "🐘 Sighting" : "🔨 Damage")}</td>
                <td style={{ fontSize: "0.85rem" }}>{r.reporterId}</td>
                <td>{r.village}, {r.district}</td>
                <td>
                  {r.numberOfElephants != null ? (
                    <span>
                      {r.numberOfElephants} elephant{r.numberOfElephants > 1 ? "s" : ""} —{" "}
                      <span style={{ color: BEHAVIOR_COLORS[r.behavior], fontWeight: 600 }}>
                        {r.behavior}
                      </span>
                    </span>
                  ) : (
                    <span>{r.damageType || r.description?.slice(0, 40)}</span>
                  )}
                </td>
                <td style={{ fontSize: "0.85rem" }}>{formatDate(r.dateTime)}</td>
                <td>
                  {r.status ? (
                    <span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span>
                  ) : (
                    <span className="badge active">Reported</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            <h2 style={{ marginTop: 0 }}>
              {selected.numberOfElephants != null ? "🐘 Sighting Report" : "🔨 Damage Report"} — {selected.reportId}
            </h2>
            <div className="modal-body" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                { label: "Report ID",      value: selected.reportId },
                { label: "Reporter",       value: selected.reporterId },
                { label: "District",       value: selected.district },
                { label: "Village",        value: selected.village },
                { label: "Date & Time",    value: formatDate(selected.dateTime) },
                { label: "Elephants",      value: selected.numberOfElephants },
                { label: "Behavior",       value: selected.behavior },
                { label: "Damage Type",    value: selected.damageType },
                { label: "Description",    value: selected.description || selected.additionalNotes },
                { label: "Status",         value: selected.status },
              ].filter((r) => r.value != null).map((r) => (
                <div className="detail-row" key={r.label}>
                  <span className="detail-label">{r.label}</span>
                  <span className="detail-value">{String(r.value)}</span>
                </div>
              ))}
            </div>
            {selected.imagePath && (
              <div style={{ marginTop: 16 }}>
                <span className="detail-label">Evidence Photo</span>
                <img src={selected.imagePath} alt="Evidence"
                  style={{ width: "100%", borderRadius: 10, marginTop: 8, maxHeight: 240, objectFit: "cover" }} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
