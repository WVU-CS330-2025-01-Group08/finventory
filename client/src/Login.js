import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';


function Login() {
  const {login} = useAuth();
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      login();
      setMessage(data.message);
      navigate(data.redirectUrl);
      
    } else {
      const data = await response.json();
      setMessage(data.message || 'Login failed');
    }
  };

  return (
    <div>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: #dbe9ff;
        }
        h1 {
          text-align: center;
          padding-top: 30px;
          font-size: 3em;
        }
        .container {
          width: 400px;
          margin: 30px auto;
          background: white;
          padding: 30px;
          border-radius: 40px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h3 {
          margin-bottom: 5px;
        }
        .signup-link {
          font-size: 0.9em;
          margin-bottom: 15px;
        }
        .signup-link a {
          color: #0073e6;
          text-decoration: none;
          font-weight: bold;
        }
        .signup-link a:hover {
          text-decoration: underline;
        }
        input[type="text"], input[type="password"] {
          display: block;
          width: 90%;
          margin: 10px auto;
          padding: 10px;
          border: 1px solid #aaa;
          border-radius: 5px;
          font-size: 1em;
          box-sizing: border-box;
        }
        .toggle-password {
          display: block;
          margin: 10px auto;
          background: #dbe9ff;
          border: 1px solid #6b8eb9;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          padding: 10px;
        }
        button {
          padding: 10px 20px;
          background: #dbe9ff;
          border: 1px solid #6b8eb9;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
          font-size: 1em;
        }
        button:hover {
          background: #c4dbf5;
        }
        .background {
          position: relative;
          height: 400px;
          background: #aac9f0;
          border-top: 5px solid white;
        }
        .wave {
          position: absolute;
          width: 100%;
          height: 100px;
          background: white;
          border-radius: 100% 100% 0 0;
          top: -50px;
        }
        .fish {
          position: absolute;
          bottom: 220px;
          right: 60px;
          width: 100px;
        }
        .fish-small {
          position: absolute;
          bottom: 200px;
          right: 160px;
          width: 60px;
        }
      `}</style>

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
          <button
            type="button"
            className="toggle-password"
            onClick={handleTogglePassword}
          >
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
      {message && <p style={{ textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default Login;
