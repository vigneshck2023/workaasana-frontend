import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Account({ setIsLoggedIn, setUserName }) {
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setUserName(name);
    setIsLoggedIn(true);

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleGuestLogin = () => {
    setUserName("Guest User");
    setIsLoggedIn(true);

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">Log in to your account</h2>
        <p className="subtitle">Please enter your details</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className="login-btn">Sign in</button>
        </form>

        {/* Continue without login */}
        <button className="guest-btn" onClick={handleGuestLogin}>
          Continue without login
        </button>
      </div>
    </div>
  );
}
