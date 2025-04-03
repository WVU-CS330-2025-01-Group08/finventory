require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const compression = require('compression');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const layersRouter = require('./routes/layers');
const db = require('./db');
const { validatePassword } = require('./validation');

app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use('/layers', layersRouter);

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
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, redirectUrl: '/home' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ username: user.username });
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
