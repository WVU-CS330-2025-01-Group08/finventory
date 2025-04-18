const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config({path: '.env.production'});
const bcrypt = require('bcrypt');
const fs = require('fs');

/**
 * Creates a pool of connections to the database.
 * 
 * Pool will queue requests if the connection limit is reached.
 * SSL is required for the connection.
 * 
 * @returns {Promise<Pool>} A pool of connections to the database.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    ssl: {
        ca: fs.readFileSync(process.env.SSL_CERT_PATH)
    },
});

/**
 * Gets a connection from the pool.
 * 
 * @returns {Promise<Connection>} A connection to the database.
 */
async function getConnection() {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

/**
 * Creates a user in the database.
 * 
 * @param {string} username - The username of the user to create.
 * @param {string} hashedPassword - The hashed password of the user to create.
 */
async function createUser(username, hashedPassword) {
    const connection = await getConnection();
    try {
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Authenticates a user in the database.
 * 
 * @param {string} username - The username of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @returns {Promise<User>} The user object if the authentication is successful, otherwise null.
 */
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
    } 
    catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Gets a user by username from the database.
 * 
 * @param {string} username - The username of the user to get.
 * @returns {Promise<User>} The user object if the user is found, otherwise null.
 */
async function getUserByUsername(username) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    } catch (error) {
        console.error('Error getting user by username:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getConnection,
    getUserByUsername,
    createUser,
    authenticateUser,
};
