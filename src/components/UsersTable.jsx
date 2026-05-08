import { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";

export default function UsersTable({ searchTerm }) {
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [users, setUsers] = useState([
    { 
      userId: "U-1001", firstName: "Kamal", lastName: "Gunaratne", nic: "199012345678",
      userRole: "Village User", email: "kamal@gmail.com", phoneNumber: "0771234567",
      gender: "Male", address: "No 12, Main Road", village: "Kandy", status: "Active", profilePicture: null
    },
    { 
      userId: "U-1002", firstName: "Sunil", lastName: "Perera", nic: "198598765432",
      userRole: "Village User", email: "sunil@gmail.com", phoneNumber: "0719876543",
      gender: "Male", address: "Lake View, South Side", village: "Galle", status: "Suspended", profilePicture: null
    }
  ]);

  const toggleStatus = (id, e) => {
    e.stopPropagation(); // Prevents the row click event from firing when clicking the button
    setUsers(users.map(u => 
      u.userId === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
    ));
  };

  const filtered = users.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userId.toLowerCase().includes(searchTerm.toLowerCase())
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
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr 
                key={u.userId} 
                className="clickable-row"
                onClick={() => setSelectedUser(u)}
              >
                <td>{u.userId}</td>
                <td>{u.village}</td>
                <td><strong>{u.firstName} {u.lastName}</strong></td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td>
                  <span className={`badge ${u.status.toLowerCase()}`}>{u.status}</span>
                </td>
                <td>
                  <button 
                    className={`action-btn ${u.status === "Active" ? "btn-suspend" : "btn-activate"}`}
                    onClick={(e) => toggleStatus(u.userId, e)}
                  >
                    {u.status === "Active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the modal if a user is selected */}
      <UserDetailsModal 
        data={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </>
  );
}