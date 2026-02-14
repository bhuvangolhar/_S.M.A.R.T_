import React, { useState, useEffect } from "react";

interface DashboardProps {
  onLogout: () => void;
}

interface UserData {
  fullName: string;
  organizationName: string;
  email: string;
  mobileNo: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const savedData = localStorage.getItem("userSignupData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    console.log("✅ Logged out from dashboard");
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>SMART 🤖</h1>
          <span className="org-name">{userData?.organizationName}</span>
        </div>
        <div className="navbar-user">
          <span className="user-email">{userData?.email}</span>
          <button onClick={handleLogout} className="logout-btn-nav">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="sidebar">
          <ul className="menu-list">
            <li className="menu-item active">
              <span>📊 Dashboard</span>
            </li>
            <li className="menu-item">
              <span>👥 Students</span>
            </li>
            <li className="menu-item">
              <span>👨‍🏫 Teachers</span>
            </li>
            <li className="menu-item">
              <span>📚 Classes</span>
            </li>
            <li className="menu-item">
              <span>📅 Attendance</span>
            </li>
            <li className="menu-item">
              <span>📈 Reports</span>
            </li>
            <li className="menu-item">
              <span>⚙️ Settings</span>
            </li>
          </ul>
        </div>

        <main className="main-content">
          <div className="dashboard-header">
            <h2>Welcome to Your Dashboard</h2>
            <p className="subtitle">School Management System</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>Total Students</h3>
              <p className="card-stat">0</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">👨‍🏫</div>
              <h3>Total Teachers</h3>
              <p className="card-stat">0</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📚</div>
              <h3>Total Classes</h3>
              <p className="card-stat">0</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Attendance Rate</h3>
              <p className="card-stat">0%</p>
            </div>
          </div>

          <div className="organization-info">
            <h3>Organization Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Organization:</label>
                <p>{userData?.organizationName}</p>
              </div>
              <div className="info-item">
                <label>Account Manager:</label>
                <p>{userData?.fullName}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{userData?.email}</p>
              </div>
              <div className="info-item">
                <label>Mobile:</label>
                <p>{userData?.mobileNo}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
