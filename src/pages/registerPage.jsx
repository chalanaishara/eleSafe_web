import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nic: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Gender: "",
    Password: "",
    Address: "",
    Village: "",
    Role: "",
    OfficerId: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.Email || !form.Password) {
      alert("Please fill required fields");
      return;
    }

    console.log(form);
    alert("Registered Successfully!");
  };

  return (
    <div className="register-container">
      {/* Header */}
      <div className="register-header">
        <h1>EleSafe Lanka</h1>
        <h2>Create Account</h2>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Loop fields except OfficerId */}
        {Object.keys(form).map((key) => {
          if (key === "OfficerId") return null;

          return (
            <div key={key} className="form-group">
              <label>{key}</label>

              {/* Gender Dropdown */}
              {key === "Gender" ? (
                <select
                  value={form.Gender}
                  onChange={(e) => handleChange("Gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : key === "Role" ? (
                <select
                  value={form.Role}
                  onChange={(e) => handleChange("Role", e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="User">User</option>
                  <option value="Wild Officer">Wild Officer</option>
                </select>
              ) : (
                <input
                  type={key === "Password" ? "password" : "text"}
                  placeholder={`Enter ${key}`}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          );
        })}

        {/* Officer ID (conditional) */}
        {form.Role === "Wild Officer" && (
          <div className="form-group">
            <label>Officer ID</label>
            <input
              type="text"
              placeholder="Enter Officer ID"
              value={form.OfficerId}
              onChange={(e) => handleChange("OfficerId", e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="btn">
          Register
        </button>

        <p className="login-link" onClick={() => navigate("/")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}