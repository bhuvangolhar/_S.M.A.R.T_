import React, { useState } from "react";

interface OrganizationSettings {
  schoolName: string;
  schoolAddress: string;
  contactEmail: string;
  contactPhone: string;
  principalName: string;
}

interface AcademicSettings {
  academicYear: string;
  schoolStartTime: string;
  schoolEndTime: string;
  gradingSystem: string;
  totalClasses: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  attendanceAlerts: boolean;
  examinationReminders: boolean;
  eventNotifications: boolean;
  parentNotifications: boolean;
}

interface SettingsModuleProps {
  onBack: () => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<
    "organization" | "academic" | "notifications" | "security"
  >("organization");

  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    schoolName: "Celestial High School",
    schoolAddress: "123 Education Street, Delhi, India",
    contactEmail: "info@celestialhighschool.edu",
    contactPhone: "+91-11-1234-5678",
    principalName: "Dr. Vikram Kumar",
  });

  const [academicSettings, setAcademicSettings] = useState<AcademicSettings>({
    academicYear: "2025-2026",
    schoolStartTime: "08:00",
    schoolEndTime: "02:00",
    gradingSystem: "10-Point Scale (A+, A, B+, B, etc.)",
    totalClasses: 12,
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      smsNotifications: true,
      attendanceAlerts: true,
      examinationReminders: true,
      eventNotifications: true,
      parentNotifications: true,
    });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editOrgMode, setEditOrgMode] = useState(false);
  const [editAcademicMode, setEditAcademicMode] = useState(false);

  const handleOrgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAcademicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAcademicSettings((prev) => ({
      ...prev,
      [name]:
        name === "totalClasses" ? parseInt(value) : value,
    }));
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveOrgSettings = () => {
    setSuccessMessage("Organization settings saved successfully!");
    setEditOrgMode(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSaveAcademicSettings = () => {
    setSuccessMessage("Academic settings saved successfully!");
    setEditAcademicMode(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSaveNotifications = () => {
    setSuccessMessage("Notification preferences saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setSuccessMessage("Password changed successfully!");
    setChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Settings</h2>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button
          className={`settings-tab-btn ${
            activeTab === "organization" ? "active" : ""
          }`}
          onClick={() => setActiveTab("organization")}
        >
          🏫 Organization
        </button>
        <button
          className={`settings-tab-btn ${
            activeTab === "academic" ? "active" : ""
          }`}
          onClick={() => setActiveTab("academic")}
        >
          📚 Academic
        </button>
        <button
          className={`settings-tab-btn ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          🔔 Notifications
        </button>
        <button
          className={`settings-tab-btn ${
            activeTab === "security" ? "active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          🔒 Security
        </button>
      </div>

      {/* Organization Settings */}
      {activeTab === "organization" && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <h3>Organization Settings</h3>
              {!editOrgMode && (
                <button
                  onClick={() => setEditOrgMode(true)}
                  className="edit-settings-btn"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            <div className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label>School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={orgSettings.schoolName}
                    onChange={handleOrgInputChange}
                    disabled={!editOrgMode}
                    className={`form-input ${!editOrgMode ? "disabled" : ""}`}
                  />
                </div>
                <div className="form-group">
                  <label>Principal Name</label>
                  <input
                    type="text"
                    name="principalName"
                    value={orgSettings.principalName}
                    onChange={handleOrgInputChange}
                    disabled={!editOrgMode}
                    className={`form-input ${!editOrgMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={orgSettings.contactEmail}
                    onChange={handleOrgInputChange}
                    disabled={!editOrgMode}
                    className={`form-input ${!editOrgMode ? "disabled" : ""}`}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={orgSettings.contactPhone}
                    onChange={handleOrgInputChange}
                    disabled={!editOrgMode}
                    className={`form-input ${!editOrgMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>School Address</label>
                  <input
                    type="text"
                    name="schoolAddress"
                    value={orgSettings.schoolAddress}
                    onChange={handleOrgInputChange}
                    disabled={!editOrgMode}
                    className={`form-input ${!editOrgMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              {editOrgMode && (
                <div className="settings-actions">
                  <button
                    onClick={handleSaveOrgSettings}
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditOrgMode(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Academic Settings */}
      {activeTab === "academic" && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <h3>Academic Settings</h3>
              {!editAcademicMode && (
                <button
                  onClick={() => setEditAcademicMode(true)}
                  className="edit-settings-btn"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            <div className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={academicSettings.academicYear}
                    onChange={handleAcademicInputChange}
                    disabled={!editAcademicMode}
                    className={`form-input ${!editAcademicMode ? "disabled" : ""}`}
                    placeholder="e.g., 2025-2026"
                  />
                </div>
                <div className="form-group">
                  <label>Total Classes</label>
                  <input
                    type="number"
                    name="totalClasses"
                    value={academicSettings.totalClasses}
                    onChange={handleAcademicInputChange}
                    disabled={!editAcademicMode}
                    className={`form-input ${!editAcademicMode ? "disabled" : ""}`}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>School Start Time</label>
                  <input
                    type="time"
                    name="schoolStartTime"
                    value={academicSettings.schoolStartTime}
                    onChange={handleAcademicInputChange}
                    disabled={!editAcademicMode}
                    className={`form-input ${!editAcademicMode ? "disabled" : ""}`}
                  />
                </div>
                <div className="form-group">
                  <label>School End Time</label>
                  <input
                    type="time"
                    name="schoolEndTime"
                    value={academicSettings.schoolEndTime}
                    onChange={handleAcademicInputChange}
                    disabled={!editAcademicMode}
                    className={`form-input ${!editAcademicMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grading System</label>
                  <input
                    type="text"
                    name="gradingSystem"
                    value={academicSettings.gradingSystem}
                    onChange={handleAcademicInputChange}
                    disabled={!editAcademicMode}
                    className={`form-input ${!editAcademicMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              {editAcademicMode && (
                <div className="settings-actions">
                  <button
                    onClick={handleSaveAcademicSettings}
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditAcademicMode(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <h3>Notification Preferences</h3>
            </div>

            <div className="notification-settings">
              <div className="notification-item">
                <div className="notification-info">
                  <h4>Email Notifications</h4>
                  <p>Receive email alerts for school updates</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="email-toggle"
                    checked={notificationSettings.emailNotifications}
                    onChange={() =>
                      handleNotificationToggle("emailNotifications")
                    }
                  />
                  <label htmlFor="email-toggle"></label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>SMS Notifications</h4>
                  <p>Receive SMS alerts on your phone</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="sms-toggle"
                    checked={notificationSettings.smsNotifications}
                    onChange={() =>
                      handleNotificationToggle("smsNotifications")
                    }
                  />
                  <label htmlFor="sms-toggle"></label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Attendance Alerts</h4>
                  <p>Get notified about attendance updates</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="attendance-toggle"
                    checked={notificationSettings.attendanceAlerts}
                    onChange={() =>
                      handleNotificationToggle("attendanceAlerts")
                    }
                  />
                  <label htmlFor="attendance-toggle"></label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Examination Reminders</h4>
                  <p>Receive exam schedule and preparation reminders</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="exam-toggle"
                    checked={notificationSettings.examinationReminders}
                    onChange={() =>
                      handleNotificationToggle("examinationReminders")
                    }
                  />
                  <label htmlFor="exam-toggle"></label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Event Notifications</h4>
                  <p>Get notified about school events and holidays</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="event-toggle"
                    checked={notificationSettings.eventNotifications}
                    onChange={() =>
                      handleNotificationToggle("eventNotifications")
                    }
                  />
                  <label htmlFor="event-toggle"></label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Parent Notifications</h4>
                  <p>Send notifications to parents</p>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="parent-toggle"
                    checked={notificationSettings.parentNotifications}
                    onChange={() =>
                      handleNotificationToggle("parentNotifications")
                    }
                  />
                  <label htmlFor="parent-toggle"></label>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  onClick={handleSaveNotifications}
                  className="save-btn"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <h3>Security Settings</h3>
            </div>

            <div className="security-settings">
              <div className="security-card">
                <div className="security-card-header">
                  <h4>🔐 Change Password</h4>
                  <p>Update your account password regularly for security</p>
                </div>

                {!changePassword ? (
                  <button
                    onClick={() => setChangePassword(true)}
                    className="change-password-btn"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="password-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className="form-input"
                      />
                    </div>

                    <div className="settings-actions">
                      <button
                        onClick={handleChangePassword}
                        className="save-btn"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => {
                          setChangePassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="security-card">
                <div className="security-card-header">
                  <h4>📱 Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <div className="toggle-switch" style={{ marginTop: "10px" }}>
                  <input type="checkbox" id="2fa-toggle" />
                  <label htmlFor="2fa-toggle"></label>
                </div>
              </div>

              <div className="security-card">
                <div className="security-card-header">
                  <h4>🌐 Active Sessions</h4>
                  <p>Manage your active login sessions</p>
                </div>
                <div className="session-info">
                  <p>Current Device: Chrome on Windows</p>
                  <p className="session-time">Last active: Just now</p>
                  <button className="logout-session-btn">Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModule;
