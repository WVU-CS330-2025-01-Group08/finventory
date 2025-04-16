// Import necessary React and routing utilities
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/*
  Component: Signup
  Description:
    This component renders a user registration form that collects a username and password.
    It includes password validation, client-side matching confirmation, and visual toggling
    between password visibility states. Upon successful registration, it redirects to the login page.
*/
function Signup() {
  // State variables for form inputs and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Refs to toggle visibility of password inputs
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  // Hook to programmatically navigate after successful signup
  const navigate = useNavigate();

  /*
    Function: handleSubmit
    Description:
      Handles form submission. It checks if passwords match and sends a POST request
      to the backend to register the user. Displays appropriate success or error messages.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    // Send POST request to backend API
    const response = await fetch('http://localhost:3000/Signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // Handle response
    if (response.ok) {
      setMessage('User registered successfully');
      navigate('/login'); // Redirect to login page
    } else {
      const data = await response.json();
      setMessage(data.error || 'Registration failed');
    }
  };

  /*
    Function: toggleBothPasswords
    Description:
      Toggles the visibility of both password input fields (password and confirm password).
      Switches input type between "password" and "text".
  */
  const toggleBothPasswords = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.type =
        passwordInputRef.current.type === 'password' ? 'text' : 'password';
    }
    if (confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.type =
        confirmPasswordInputRef.current.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div>
      {/* Inline CSS styles for the Signup page */}
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
        .login-link {
          font-size: 0.9em;
          margin-bottom: 15px;
        }
        .login-link a {
          color: #0073e6;
          text-decoration: none;
          font-weight: bold;
        }
        .login-link a:hover {
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
        .password-rules {
          text-align: left;
          font-size: 0.9em;
          margin: 0 5% 10px 5%;
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
          padding: 10px;
          background: #dbe9ff;
          border: 1px solid #6b8eb9;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
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

      {/* Main heading */}
      <h1>Getting Started</h1>

      {/* Signup form container */}
      <div className="container">
        <h3>Make Your Account</h3>
        <div className="login-link">
          Already have an account? <Link to="/login">Login Here</Link>
        </div>

        {/* Signup form */}
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
            placeholder="Password"
            ref={passwordInputRef}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="password-rules">
            Password must include:
            <br />- at least 8 characters
            <br />- one number
            <br />- one special character
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordInputRef}
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={toggleBothPasswords}
          >
            Show Passwords
          </button>
          <button type="submit">
            Create Account
          </button>
        </form>
      </div>

      {/* Decorative background with fish and wave art */}
      <div className="background">
        <div className="wave"></div>
        <img src="/fishCartoon.png" alt="Fish" className="fish" />
        <img src="/fishCartoon.png" alt="Fish small" className="fish-small" />
      </div>

      {/* Display feedback messages (success or error) */}
      {message && <p style={{ textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

// Export the Signup component so it can be used in routing
export default Signup;
