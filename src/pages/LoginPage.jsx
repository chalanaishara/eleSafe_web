import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Login clicked");

    // navigate("/dashboard");
  };

  return (
    <div className="login-container">
      {/* Header */}
      <div className="login-header">
        <h1>EleSafe Lanka</h1>
      </div>

      {/* Form */}
      <div className="login-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">
          Sign in to report incidents and track activity.
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <label>USERNAME OR EMAIL</label>
          <div className="input-box">
            <FaUser />
            <input type="text" placeholder="RangerID / Email" />
          </div>

          {/* Password */}
          <label>PASSWORD</label>
          <div className="input-box">
            <FaLock />

            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="••••••••"
            />

            <span
              className="eye"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p className="forgot">Forgot Password?</p>

          {/* Button */}
          <button type="submit" className="login-btn">
            <FaSignInAlt />
            LOG IN
          </button>
        </form>

        {/* Footer */}
        <p className="footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
}