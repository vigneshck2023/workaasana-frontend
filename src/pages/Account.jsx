import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // reuse your login styling

export default function Account() {
  // state to show / hide password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      {/* card */}
      <div className="login-card">

        {/* title */}
        <h2 className="title">Log in to your account</h2>
        <p className="subtitle">Please enter your details.</p>

        {/* form */}
        <form className="login-form">

          {/* email field */}
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          {/* password field */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />

            {/* eye icon to toggle password visibility */}
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* login button */}
          <button className="login-btn">Sign in</button>
        </form>

        {/* sign up link */}
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
