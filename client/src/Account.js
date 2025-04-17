import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Account.css";

function Account() {
  // 1️⃣ User & preview state
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
  });
  const [preview, setPreview] = useState(null);

  // 2️⃣ Favorites (dummy data here; swap for real API fetch)
  const [favorites, setFavorites] = useState([]);

  // 3️⃣ Password‑change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // TODO: replace this with an actual fetch(‘/api/user/favorites’)
    setFavorites([
      { id: 1, name: "River Bend" },
      { id: 2, name: "Lakeview Point" },
      { id: 3, name: "Fox Creek" },
    ]);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    // TODO: upload `file` to your backend
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don’t match!");
      return;
    }
    // TODO: send { currentPassword, newPassword } to backend
    console.log("Changing password…", { currentPassword, newPassword });

    // clear fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <header>
        <Link to="/" className="logo">
          <img src="/fishCartoon.png" alt="Logo" />
          Finventory
        </Link>
        <ul>
          <li>
            <Link to="/home">Map</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </header>

      <div className="account-page">
        <h1>Account Settings</h1>
        <div className="account-content">
          
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="profile-image-section">
              <img
                src="ProfilePictureIcon.png"
                alt="Profile"
                className="profile-image"
              />
              <p className="profile-name">{user.name}</p>

              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <label htmlFor="avatarInput" className="upload-btn">
                Choose Photo
              </label>
            </div>
          </aside>

          {/* Main content */}
          <div className="account-main">
        
            {/* Change password */}
            <section className="change-password-section">
              <h2>Change Password</h2>
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <label>
                  Current Password
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </label>
                <label>
                  New Password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Confirm New Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </form>
            </section>

            {/* Favorites list */}
            <section className="favorites-section">
              <h2>❤️ Favorite Locations</h2>
              {favorites.length > 0 ? (
                <ul className="favorites-list">
                  {favorites.map((loc) => (
                    <li className="favorite-item" key={loc.id}>
                      {loc.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You haven’t hearted any spots yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      <footer>
          <p className="footer-bottom">&copy; 2025 Finventory. All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default Account;

