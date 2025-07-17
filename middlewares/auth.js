// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

function authMiddlewareJwt(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = {
    requireLogin,
    authMiddlewareJwt,
};
