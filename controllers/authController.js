const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Signup controller
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { userName, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: userName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Signup successful',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('❌ Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login controller
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Store session data
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.status(200).json({
            message: 'Login successful',
            user: req.session.user
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout controller
const logout = (req, res) => {
    if (!req.session) {
        return res.status(400).json({ message: 'No active session found' });
    }

    const sid = req.sessionID;
    console.log('Destroying session ID:', sid);

    req.session.destroy(async (err) => {
        if (err) {
            console.error('❌ Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        console.log('✅ Session destroyed successfully');
        res.json({ message: 'Logged out successfully' });
    });
};

module.exports = {
    signup,
    login,
    logout,
};
