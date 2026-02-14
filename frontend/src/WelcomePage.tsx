import React, { useState, useEffect } from "react";

interface WelcomePageProps {
  onLogout: () => void;
}

interface UserData {
  fullName: string;
  organizationName: string;
  email: string;
  mobileNo: string;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const savedData = localStorage.getItem("userSignupData");
    console.log("📦 WelcomePage - Retrieved from localStorage:", savedData);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("✅ WelcomePage - Parsed user data:", parsedData);
      setUserData(parsedData);
    } else {
      console.log("❌ WelcomePage - No data found in localStorage");
    }
  }, []);

  const handleLogout = () => {
    // Only clear the session flag, keep the account data
    localStorage.removeItem("userSession");
    console.log("✅ Logged out (account data preserved for login)");
    onLogout();
  };

  if (!userData) {
    return (
      <div className="welcome-container">
        <div className="welcome-box">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <div className="welcome-header">
          <h1>Welcome to SMART! 🎉</h1>
          <p className="welcome-subtitle">Your school management system is ready</p>
        </div>

        <div className="organization-card">
          <h2>Organization Details</h2>
          <div className="org-details">
            <div className="detail-item">
              <span className="detail-label">Organization:</span>
              <span className="detail-value">{userData.organizationName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Manager:</span>
              <span className="detail-value">{userData.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userData.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mobile:</span>
              <span className="detail-value">{userData.mobileNo}</span>
            </div>
          </div>
        </div>

        <div className="welcome-message">
          <p>
            Your account has been successfully created! You can now access all the AI-powered
            school monitoring features in the SMART system. Get ready to streamline your school
            operations!
          </p>
        </div>

        <div className="welcome-actions">
          <button className="continue-btn">Continue to Dashboard</button>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
