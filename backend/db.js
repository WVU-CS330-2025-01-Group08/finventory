const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10, // Adjust as needed
});

async function getConnection() {
    try {
        return await pool.getConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

async function createUser(username, hashedPassword) {
    const connection = await getConnection();
    try {
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    } finally {
        connection.release();
    }
}

async function authenticateUser(username, password) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return null; // User not found
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null; // Incorrect password
        }
        return user; // Return the user object if credentials are valid
    } finally {
        connection.release();
    }
}
async function getUserByUsername(username) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    } finally {
        connection.release();
    }
}

async function getUserById(id) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }
  

module.exports = {
    getConnection,
    getUserByUsername,
    createUser,
    authenticateUser,
    getUserById,
};
