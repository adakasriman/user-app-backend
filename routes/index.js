const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);

module.exports = router;
