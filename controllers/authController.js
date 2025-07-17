const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { userName, gmail, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const existingUser = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const result = await pool.query(
            'INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3) RETURNING *',
            [userName, gmail, hashed]
        );

        res.status(201).json({ message: 'Signup successful', user: result.rows[0] });
    } catch (err) {
        console.error('err', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { gmail, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                gmail: user.gmail,
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
};

const logout = (req, res) => {
    const sid = req.sessionID;
    console.log('Trying to destroy session ID:', sid);

    req.sessionStore.destroy(sid, async (err) => {
        if (err) {
            console.error('Destroy error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        const result = await pool.query('SELECT * FROM session WHERE sid = $1', [sid]);
        if (result.rows.length > 0) {
            console.warn('Session still exists in DB:', result.rows[0]);
        } else {
            console.log('✅ Session removed from DB');
        }

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.json({ message: 'Logged out successfully' });
    });
};

module.exports = {
    signup,
    login,
    logout
};

