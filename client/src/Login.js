import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const handleTogglePassword = () => {
    const input = passwordInputRef.current;
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      login();
      setMessage(data.message);
      navigate(data.redirectUrl);
    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1>Welcome to Finventory!</h1>
      <div className="container">
        <h3>Login to Your Account</h3>
        <div className="signup-link">
          New? <Link to="/Signup">Sign up here!</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="toggle-password" onClick={handleTogglePassword}>
            Show Password
          </button>
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="background">
        <div className="wave"></div>
        <img src="/fishCartoon.png" alt="Fish" className="fish" />
        <img src="/fishCartoon.png" alt="Fish" className="fish-small" />
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
