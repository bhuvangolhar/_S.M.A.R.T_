import React, { useState } from "react";

interface LoginPageProps {
  onBack: () => void;
  onGoToSignup: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onGoToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    // Check if user exists in localStorage
    const savedData = localStorage.getItem("userSignupData");
    console.log("🔍 Checking for saved data...");
    console.log("📦 LocalStorage contents:", savedData);
    
    if (!savedData) {
      console.log("❌ No saved data found");
      setError("No account found. Please sign up first");
      return;
    }

    const userData = JSON.parse(savedData);
    console.log("✅ Found saved user data:", userData);

    // Verify email and password
    if (userData.email !== email) {
      console.log("❌ Email mismatch. Expected:", userData.email, "Got:", email);
      setError("Email not found. Please check and try again");
      return;
    }

    if (userData.password !== password) {
      console.log("❌ Password mismatch. Expected:", userData.password, "Got:", password);
      setError("Incorrect password. Please try again");
      return;
    }

    // Login successful - set session flag
    localStorage.setItem("userSession", JSON.stringify({ loggedIn: true, email: email }));
    console.log("✅ Login successful for:", email);
    console.log("📦 Session set:", localStorage.getItem("userSession"));
    setEmail("");
    setPassword("");
    onLoginSuccess();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>SMART System Login</h2>
        <p className="login-subtitle">School Monitoring with AI for Real-time Tasks</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{" "}
          <button 
            type="button" 
            className="link-btn" 
            onClick={onGoToSignup}
          >
            Sign Up
          </button>
        </p>

        <button onClick={onBack} className="back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
