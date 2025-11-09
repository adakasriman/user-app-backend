const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const otpController = require('../controllers/auth/otpController');
const {signupValidationRules, loginValidationRules} = require('../validators/auth_validations/signupValidator');

router.post('/signup', 
    signupValidationRules,
    authController.signup
);

router.post('/login',
    loginValidationRules,
    authController.login
);

router.post('/send-otp', otpController.sendOtp);
router.post('/verify-otp', otpController.verifyOtp);

router.post('/logout', authController.logout);

module.exports = router;
