const express = require('express');
const {authMiddlewareJwt} = require('../middlewares/auth');
const userController = require('../controllers/users/userController');
const router = express.Router();

router.post('/users', authMiddlewareJwt, userController.getUsersList);
router.post('/update-password', authMiddlewareJwt, userController.updatePassword);
router.post('/users/:id', authMiddlewareJwt, userController.deleteUser);

module.exports = router;

