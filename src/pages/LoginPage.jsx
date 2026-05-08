import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // State for backend connection
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // BACKEND CONNECT LOGIC:
    // try {
    //   const response = await fetch("YOUR_BACKEND_API/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(credentials)
    //   });
    //   const data = await response.json();
    //   if(data.success) navigate("/dashboard");
    // } catch (err) { console.error(err); }

    // Simulation for now:
    console.log("Login credentials:", credentials);
    navigate("/dashboard"); 
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>EleSafe Lanka</h1>
      </div>

      <div className="login-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to manage safety incidents.</p>

        <form onSubmit={handleLogin}>
          <label>USERNAME OR EMAIL</label>
          <div className="input-box">
            <FaUser />
            <input 
              type="text" 
              name="identifier"
              placeholder="RangerID / Email" 
              value={credentials.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <label>PASSWORD</label>
          <div className="input-box">
            <FaLock />
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <span className="eye" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p className="forgot">Forgot Password?</p>

          <button type="submit" className="login-btn">
            <FaSignInAlt /> LOG IN
          </button>
        </form>

        <p className="footer">
          Don't have an account? <span onClick={() => navigate("/register")}>Register Here</span>
        </p>
      </div>
    </div>
  );
}