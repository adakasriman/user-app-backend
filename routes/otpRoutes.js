const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otp/otpController');
const router = express.Router();

// Route to send OTP
router.post('/otp/send-otp', sendOtp);

// Route to verify OTP
router.post('/otp/verify-otp', verifyOtp);

module.exports = router;
