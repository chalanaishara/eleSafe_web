import { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";

export default function OfficersTable({ searchTerm }) {
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const [officers, setOfficers] = useState([
    { 
      userId: "OFF-201", firstName: "Ajith", lastName: "Bandara", nic: "198234567890",
      userRole: "Wild Officer (WP-5022)", email: "ajith.b@wildlife.gov", phoneNumber: "0777778888",
      gender: "Male", address: "Quarter 4, Ranger Camp", village: "Yala", status: "Active", profilePicture: null
    },
    { 
      userId: "OFF-205", firstName: "Saman", lastName: "Rathnayake", nic: "198856789012",
      userRole: "Wild Officer (WP-8810)", email: "saman.r@wildlife.gov", phoneNumber: "0712223333",
      gender: "Male", address: "Camp 2, North Zone", village: "Wilpattu", status: "Active", profilePicture: null
    }
  ]);

  const toggleStatus = (id, e) => {
    e.stopPropagation(); // Prevents opening the modal when toggling status
    setOfficers(officers.map(o => 
      o.userId === id ? { ...o, status: o.status === "Active" ? "Suspended" : "Active" } : o
    ));
  };

  const filtered = officers.filter(o => 
    o.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Village</th>
              <th>Name</th>
              <th>Role / Badge</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr 
                key={o.userId} 
                className="clickable-row"
                onClick={() => setSelectedOfficer(o)}
              >
                <td>{o.userId}</td>
                <td>{o.village}</td>
                <td><strong>{o.firstName} {o.lastName}</strong></td>
                <td>{o.userRole}</td>
                <td>{o.phoneNumber}</td>
                <td>
                  <span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span>
                </td>
                <td>
                  <button 
                    className={`action-btn ${o.status === "Active" ? "btn-suspend" : "btn-activate"}`}
                    onClick={(e) => toggleStatus(o.userId, e)}
                  >
                    {o.status === "Active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDetailsModal 
        data={selectedOfficer} 
        onClose={() => setSelectedOfficer(null)} 
      />
    </>
  );
}