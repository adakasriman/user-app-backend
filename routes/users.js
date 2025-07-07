const express = require('express');
const requireLogin = require('../middlewares/auth');
const router = express.Router();

const pool = require('../db');

router.post('/signup', async (req, res) => {
    const { userName, gmail, password } = req.body;
    // Basic validation (optional)
    if (!userName || !gmail || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Optional: check if email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3) RETURNING *',
            [userName, gmail, password]
        );

        res.status(201).json({ message: 'Signup successful', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        req.session.user = {
            id: user.id,
            email: user.gmail,
            fullName: user.name,
        };

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session not saved' });
            }

            res.json({ message: 'Login successful', user });
        });
    } catch (err) {
        res.status(500).send('Database error');
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        res.json({ message: 'Logged out successfully' });
    });
});

router.get('/users', requireLogin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;

        res.json({ message: 'User found successfully', users });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});


router.put('/update-password', requireLogin, async (req, res) => {
    const { gmail, oldPassword, newPassword } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        if (user.password !== oldPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        await pool.query('UPDATE users SET password = $1 WHERE gmail = $2', [newPassword, gmail]);

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).send('Database error');
    }
});



router.delete('/users/:id', requireLogin, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid user ID' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

module.exports = router;

