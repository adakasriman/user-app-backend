const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const otpRoutes = require('./otpRoutes');

const router = express.Router();
// auth routes
router.use(authRoutes);
// user routes
router.use(userRoutes);
// otp routes
router.use(otpRoutes);


module.exports = router;
