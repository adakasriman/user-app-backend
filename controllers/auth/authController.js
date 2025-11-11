// controllers/auth.controller.js
const { validationResult } = require('express-validator');
const { signupService, loginService } = require('../../service/auth');
const { UserSignupDTO, UserLoginDTO } = require('../../dtos/user/user.dto');
const { sendOtpService } = require('../../service/otpService');
const { OtpRequestDTO } = require('../../dtos/user/otp.dto');

// Signup
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { userName, email, password } = req.body;

    try {
        const user = await signupService(new UserSignupDTO({ userName, email, password }));
        res.status(201).json({ message: 'Signup successful', user });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
};

// Login
const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { email, password } = req.body;

    try {
        const user = await loginService(new UserLoginDTO({ email, password }));
        req.session.user = user;
        const otpDto = new OtpRequestDTO(req.body);
        await sendOtpService(otpDto);
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
    }
};

// Logout
const logout = (req, res) => {
    if (!req.session) {
        return res.status(400).json({ message: 'No active session found' });
    }

    //   const sid = req.sessionID;
    //   console.log('Destroying session ID:', sid);

    req.session.destroy((err) => {
        if (err) {
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
