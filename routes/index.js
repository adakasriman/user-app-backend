const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();
// auth routes
router.use(authRoutes);
// user routes
router.use(userRoutes);


module.exports = router;
