const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {signupValidationRules, loginValidationRules} = require('../validators/auth_validations/signupValidator');

router.post('/signup', 
    signupValidationRules, // here we can add multiple middlewares
    authController.signup
);

router.post('/login',
    loginValidationRules,
    authController.login
);
router.post('/logout', authController.logout);

module.exports = router;
