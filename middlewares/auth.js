// middlewares/auth.js
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // ✅ user is logged in
    }
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
}

module.exports = requireLogin;
