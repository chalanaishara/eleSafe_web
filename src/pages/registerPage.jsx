import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Nic: "", FirstName: "", LastName: "", Email: "",
    PhoneNumber: "", Gender: "", Password: "",
    Address: "", Village: "", Role: "", OfficerId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!form.Email || !form.Password || !form.Role) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Registering user:", form);
    // BACKEND CONNECT LOGIC:
    // const res = await fetch("API/register", { method: "POST", ... })
    
    alert("Registered Successfully!");
    navigate("/"); // Go to login after registration
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>EleSafe Lanka</h1>
        <h2>Create Account</h2>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input name="FirstName" placeholder="First Name" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input name="LastName" placeholder="Last Name" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>NIC Number</label>
          <input name="Nic" placeholder="NIC" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="Email" type="email" placeholder="Email" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="PhoneNumber" placeholder="Phone" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="Gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Village</label>
          <input name="Village" placeholder="Village" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="Role" onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Wild Officer">Wild Officer</option>
          </select>
        </div>
        
        {form.Role === "Wild Officer" && (
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>Officer ID</label>
            <input name="OfficerId" placeholder="Officer ID" onChange={handleChange} />
          </div>
        )}

        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label>Password</label>
          <input name="Password" type="password" placeholder="Password" onChange={handleChange} />
        </div>

        <button type="submit" className="btn">Register</button>
        <p className="login-link" onClick={() => navigate("/")}>Already have an account? Login</p>
      </form>
    </div>
  );
}