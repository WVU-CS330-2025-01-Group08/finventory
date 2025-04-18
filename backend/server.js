const dotenv = require('dotenv').config({path: '.env.production'});
const express = require('express');
const bcrypt = require('bcrypt');
const compression = require('compression');
const app = express();
const cors = require('cors');
const layersRouter = require('./routes/layers');
const db = require('./db');
const { validatePassword } = require('./validation');

// Setup the server to use JSON, CORS, and compression.
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:" + process.env.FRONTEND_PORT, // Allow only frontend to communicate with the backend
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  })
);
app.use(compression()); // Enable compression for all routes
app.use('/layers', layersRouter);

/**
 * User registration route
 * 
 * This route allows users to register for an account.
 * It validates the password and creates a new user in the database.
 * 
 * @returns {Object} - A JSON object containing a message and a redirect URL.
 */
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const passwordError = validatePassword(password);
  if (!passwordError) {
    return res.status(400).json({ message: 'password error:' + passwordError });
  }

  try {
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, hashedPassword);
    res.json({ message: 'User registered successfully', redirectUrl: '/login' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Database error' + error});
  }
});

/**
 * User login route
 * 
 * This route allows users to login to their account.
 * It validates the credentials and creates a new user in the database.
 *
 * @returns {Object} - A JSON object containing a message and a redirect URL.
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', redirectUrl: '/home' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database error' + error });
  }
});

// Start the server on the specified port.
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on port ${process.env.BACKEND_PORT}`);
});
