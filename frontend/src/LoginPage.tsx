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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Call backend API
    try {
      console.log("📡 Sending login request to backend...");
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("❌ Login failed:", data.error);
        setError(data.error || "Login failed");
        return;
      }

      // Save to localStorage for session
      const userData = data.user;
      localStorage.setItem("userSignupData", JSON.stringify({
        fullName: userData.fullName,
        organizationName: userData.organizationName,
        email: userData.email,
        mobileNo: userData.mobileNo,
      }));
      localStorage.setItem("userSession", JSON.stringify({ loggedIn: true, email: email }));
      
      console.log("✅ Login successful:", data.user);
      setEmail("");
      setPassword("");
      onLoginSuccess();
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Error connecting to server. Please try again.");
    }
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
