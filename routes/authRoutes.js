const express = require('express');
const router = express.Router();
const pool = require('../db');

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
        console.error(err);
        res.status(500).send('Database error');
    }
});

router.post('/logout', (req, res) => {
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
});

module.exports = router;
