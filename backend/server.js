require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const layersRouter = require('./routes/layers');
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Allow only frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  })
);
app.use('/layers', layersRouter);

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// User registration route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Validate username to be alphanumeric
  const alphanumericRegex = /^[a-z0-9]+$/i;
  if (!alphanumericRegex.test(username)) {
    return res.status(400).json({ message: 'Username must be alphanumeric' });
  }

  // Validate password to contain only alphanumeric characters and allowed special characters
  const passwordValidationRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
  if (!passwordValidationRegex.test(password)) {
    return res.status(400).json({ message: 'Password contains invalid characters' });
  }
  const passwordRequirementsRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+=-])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRequirementsRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one number, and at least one special character' });
  }

  // Check if the username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // If username does not exist, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User registered successfully' });
    });
  });
});

// Basic authentication route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate username to be alphanumeric
  const alphanumericRegex = /^[a-z0-9]+$/i;
  if (!alphanumericRegex.test(username)) {
    return res.status(400).json({ message: 'Username must be alphanumeric' });
  }

  // Validate password to contain only alphanumeric characters and allowed special characters
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password contains invalid characters' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ 
          message: 'Authentication successful',
          redirectUrl: '/home'
        });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
