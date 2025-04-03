import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Account.css";

function Account() {
  const [profile, setProfile] = useState({ username: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
  
      try {
        const response = await fetch('http://localhost:3000/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch profile data');
        }
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      }
    }
  
    fetchProfile();
  }, []);
  
  return (
    <>
      <header>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/resources">Favorites</Link></li>
          <li><Link to="/news">News and Updates</Link></li>
          <li><Link to="/account">Account</Link></li>
        </ul>
      </header>

      <h1>Account Settings</h1>
      <div className="container">
        <div className="account-content">
          <div className="account-sidebar">
            <ul>
              <li><Link to="/account/profile">Profile</Link></li>
              <li><Link to="/account/password">Change Password</Link></li>
              <li><Link to="/account/notifications">Notifications</Link></li>
              <li><Link to="/account/privacy">Privacy</Link></li>
            </ul>
          </div>

          <div className="account-main">
            <h2>Profile</h2>
            <div className="profile-section">
              <img src="/profilePlaceholder.png" alt="Profile" className="profile-image" />
              <div className="profile-info">
                <p><strong>Username:</strong> {profile.username || "Loading..."}</p>
              </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>

      <div className="background">
        <div className="wave"></div>
        <img src="/fishCartoon.png" alt="Fish" className="fish" />
        <img src="/fishCartoon.png" alt="Fish small" className="fish-small" />
      </div>

      <footer>
        <p>&copy; 2025 Finventory. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Account;
