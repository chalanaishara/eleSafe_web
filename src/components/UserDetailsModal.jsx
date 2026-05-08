import React from "react";

export default function UserDetailsModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* e.stopPropagation() prevents clicking inside the modal from closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <div className="modal-avatar">
            {data.profilePicture ? (
              <img src={data.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{data.firstName[0]}{data.lastName[0]}</div>
            )}
          </div>
          <div className="modal-title-info">
            <h2>{data.firstName} {data.lastName}</h2>
            <span className={`badge ${data.status.toLowerCase()}`}>{data.status}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">User ID:</span>
            <span className="detail-value">{data.userId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">{data.userRole}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">NIC:</span>
            <span className="detail-value">{data.nic}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{data.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone Number:</span>
            <span className="detail-value">{data.phoneNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{data.gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{data.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Village:</span>
            <span className="detail-value">{data.village}</span>
          </div>
        </div>
      </div>
    </div>
  );
}