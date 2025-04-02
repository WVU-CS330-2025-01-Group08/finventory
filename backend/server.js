require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const compression = require('compression');
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
app.use(compression()); // Enable compression for all routes
app.use('/layers', layersRouter);

// User registration route
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
    res.status(500).json({ error: 'Database error' });
  }
});

// Basic authentication route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const user = await db.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', redirectUrl: '/home' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
