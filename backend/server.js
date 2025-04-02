require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const layersRouter = require('./routes/layers');
const db = require('./db');
const { validatePassword } = require('./validation'); 

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Allow only frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  })
);
app.use('/layers', layersRouter);

// User registration route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const passwordError = validatePassword(password);
  if (passwordError) {
      return res.status(400).json({ message: passwordError });
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

  const passwordError = validatePassword(password);
  if (passwordError) {
      return res.status(400).json({ message: passwordError });
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
