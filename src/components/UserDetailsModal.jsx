// src/components/UserDetailsModal.jsx
export default function UserDetailsModal({ data, onClose }) {
  if (!data) return null;

  const rows = [
    { label: "User ID",      value: data.userId },
    { label: "Role",         value: data.role },
    { label: "NIC",          value: data.nic },
    { label: "Email",        value: data.email },
    { label: "Phone",        value: data.phoneNumber },
    { label: "Gender",       value: data.gender },
    { label: "Village",      value: data.village },
    { label: "Address",      value: data.address },
    { label: "Badge No.",    value: data.badgeNumber },
    { label: "Station",      value: data.station },
    { label: "Status",       value: data.status },
  ].filter((r) => r.value);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-header">
          <div className="modal-avatar">
            {data.profilePicture ? (
              <img src={data.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
            )}
          </div>
          <div className="modal-title-info">
            <h2>{data.firstName} {data.lastName}</h2>
            <span className={`badge ${data.status?.toLowerCase()}`}>{data.status}</span>
          </div>
        </div>

        <div className="modal-body">
          {rows.map((r) => (
            <div className="detail-row" key={r.label}>
              <span className="detail-label">{r.label}</span>
              <span className="detail-value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
