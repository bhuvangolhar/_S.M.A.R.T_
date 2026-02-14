import React, { useState } from "react";

interface SignupPageProps {
  onBack: () => void;
  onGoToLogin: () => void;
  onSignupSuccess: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onGoToLogin, onSignupSuccess }) => {
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Signup form submitted");
    console.log("Form data:", { fullName, organizationName, email, mobileNo, password, confirmPassword });
    
    setError("");

    // Basic validation
    if (!fullName || !organizationName || !email || !mobileNo || !password || !confirmPassword) {
      const errorMsg = "Please fill in all fields";
      console.log("❌ Validation failed:", errorMsg);
      setError(errorMsg);
      return;
    }

    if (!email.includes("@")) {
      const errorMsg = "Please enter a valid email";
      console.log("❌ Email validation failed:", errorMsg);
      setError(errorMsg);
      return;
    }

    if (mobileNo.length < 10) {
      const errorMsg = "Please enter a valid mobile number";
      console.log("❌ Mobile validation failed:", errorMsg);
      setError(errorMsg);
      return;
    }

    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters";
      console.log("❌ Password length validation failed:", errorMsg);
      setError(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match";
      console.log("❌ Password match validation failed:", errorMsg);
      setError(errorMsg);
      return;
    }

    // Call backend API
    try {
      console.log("📡 Sending signup request to backend...");
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          organizationName,
          email,
          mobileNo,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("❌ Signup failed:", data.error);
        setError(data.error || "Signup failed");
        return;
      }

      // Save to localStorage for session
      const userData = {
        fullName,
        organizationName,
        email,
        mobileNo,
        password,
      };
      localStorage.setItem("userSignupData", JSON.stringify(userData));
      localStorage.setItem("userSession", JSON.stringify({ loggedIn: true, email: email }));
      
      console.log("✅ Signup successful:", data.user);
      console.log("📦 Session set locally");
      
      // Reset form and navigate to welcome page
      setFullName("");
      setOrganizationName("");
      setEmail("");
      setMobileNo("");
      setPassword("");
      setConfirmPassword("");
      
      onSignupSuccess();
    } catch (error) {
      console.error("❌ Signup error:", error);
      setError("Error connecting to server. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p className="signup-subtitle">Join SMART System</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizationName">Organization Name</label>
            <input
              type="text"
              id="organizationName"
              placeholder="Enter organization name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="form-input"
            />
          </div>

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
            <label htmlFor="mobileNo">Mobile Number</label>
            <input
              type="tel"
              id="mobileNo"
              placeholder="Enter your mobile number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <button 
            type="button" 
            className="link-btn" 
            onClick={onGoToLogin}
          >
            Login
          </button>
        </p>

        <button onClick={onBack} className="back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
