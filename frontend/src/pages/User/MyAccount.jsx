import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MyAccount.css';

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    // Get dark mode setting
    const isDark = localStorage.getItem('darkMode') === 'enabled';
    setDarkMode(isDark);

    // Get notifications setting
    const notifEnabled = localStorage.getItem('notifications') !== 'disabled';
    setNotifications(notifEnabled);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
  };

  const toggleNotifications = () => {
    const newNotif = !notifications;
    setNotifications(newNotif);
    localStorage.setItem('notifications', newNotif ? 'enabled' : 'disabled');
  };

  return (
    <div className="account-page">
      {/* Welcome Box */}
      <div className="welcome-box">
        <div className="welcome-icon">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="welcome-text">
          <h2>WELCOME,</h2>
          <h2>{user?.name?.toUpperCase() || 'USER'}</h2>
        </div>
      </div>

      {/* Orders Section */}
      <div className="account-section">
        <h3 className="section-title">ORDERS</h3>
        <ul className="account-list">
          <li>
            <Link to="/orders/status" className="account-link">
              <span>
                <i className="far fa-clock"></i>
                Order Status
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
          <li>
            <Link to="/orders/cancel" className="account-link">
              <span>
                <i className="fas fa-sync-alt"></i>
                Cancel Order/Return or Refund
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
          <li>
            <Link to="/purchases" className="account-link">
              <span>
                <i className="fas fa-file-alt"></i>
                Order History
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
        </ul>
      </div>

      {/* Account Settings Section */}
      <div className="account-section">
        <h3 className="section-title">ACCOUNT SETTINGS</h3>
        <ul className="account-list">
          <li>
            <Link to="/account/edit-profile" className="account-link">
              <span>
                <i className="fas fa-user-edit"></i>
                Edit Profile
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
          <li>
            <Link to="/account/change-password" className="account-link">
              <span>
                <i className="fas fa-lock"></i>
                Change Password
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
          <li>
            <Link to="/account/shipping" className="account-link">
              <span>
                <i className="fas fa-map-marker-alt"></i>
                Update Shipping Details
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
        </ul>
      </div>

      {/* App Settings Section */}
      <div className="account-section">
        <h3 className="section-title">APP SETTINGS</h3>
        <ul className="account-list">
          <li>
            <div className="toggle-container">
              <div className="toggle-label">
                <i className="fas fa-moon"></i>
                <span>Dark Mode</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={toggleDarkMode}
                />
                <span className="slider"></span>
              </label>
            </div>
          </li>
          <li>
            <div className="toggle-container">
              <div className="toggle-label">
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={toggleNotifications}
                />
                <span className="slider"></span>
              </label>
            </div>
          </li>
          <li>
            <Link to="/contact" className="account-link">
              <span>
                <i className="fas fa-phone-alt"></i>
                Contact Support
              </span>
              <i className="fas fa-chevron-right arrow-icon"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}