import { useState } from "react";
import {
  FaCog,
  FaUser,
  FaBell,
  FaRobot,
  FaPalette,
  FaSave,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("My Business");
  const [ownerName, setOwnerName] = useState("Business Owner");
  const [email, setEmail] = useState("owner@example.com");

  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  const [message, setMessage] = useState("");

  const handleSave = () => {
    localStorage.setItem(
      "businessSettings",
      JSON.stringify({
        businessName,
        ownerName,
        email,
        notifications,
        lowStockAlerts,
        aiRecommendations,
      })
    );

    setMessage("Settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-header">
        <div className="settings-title">
          <div className="settings-main-icon">
            <FaCog />
          </div>

          <div>
            <h1>Settings</h1>
            <p>Manage your business monitor preferences</p>
          </div>
        </div>

        <button className="save-settings-btn" onClick={handleSave}>
          <FaSave />
          Save Changes
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="settings-success">
          <FaCheckCircle />
          {message}
        </div>
      )}

      {/* Business Profile */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <FaUser />
          </div>

          <div>
            <h2>Business Profile</h2>
            <p>Update your basic business information</p>
          </div>
        </div>

        <div className="settings-form-grid">

          <div className="settings-input-group">
            <label>Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
            />
          </div>

          <div className="settings-input-group">
            <label>Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner name"
            />
          </div>

          <div className="settings-input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <FaBell />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>Control business alerts and notifications</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>Business Notifications</h3>
            <p>Receive important business performance alerts</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <h3>Low Stock Alerts</h3>
            <p>Get notified when products reach low stock levels</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={lowStockAlerts}
              onChange={(e) => setLowStockAlerts(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

      </div>

      {/* AI Settings */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <FaRobot />
          </div>

          <div>
            <h2>AI Preferences</h2>
            <p>Configure AI-powered business assistance</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>AI Recommendations</h3>
            <p>
              Show AI-generated recommendations based on business data
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={aiRecommendations}
              onChange={(e) =>
                setAiRecommendations(e.target.checked)
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="ai-info-box">
          <FaRobot />

          <div>
            <strong>AI Business Monitor</strong>
            <p>
              AI analyzes sales, expenses, inventory and business
              performance to provide actionable insights.
            </p>
          </div>
        </div>

      </div>

      {/* Appearance */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            <FaPalette />
          </div>

          <div>
            <h2>Dashboard Preferences</h2>
            <p>Customize your dashboard experience</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <h3>Dashboard Theme</h3>
            <p>Current interface theme</p>
          </div>

          <span className="theme-badge">
            Premium Light
          </span>
        </div>

      </div>

      {/* Account */}
      <div className="settings-card danger-settings">

        <div className="settings-card-header">
          <div className="settings-section-icon logout-icon">
            <FaSignOutAlt />
          </div>

          <div>
            <h2>Account</h2>
            <p>Manage your current session</p>
          </div>
        </div>

        <button
          className="logout-settings-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Settings;