const { body } = require('express-validator');

const signupValidationRules = [
  body('userName')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),

  body('gmail')
    .trim()
    .notEmpty().withMessage('Gmail is required')
    .isEmail().withMessage('Gmail must be valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidationRules = [
    body('gmail')
      .trim()
      .notEmpty().withMessage('Gmail is required')
      .isEmail().withMessage('Gmail must be valid')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required')
];

const updatePasswordValidationRules = [
    body('gmail')
      .trim()
      .notEmpty().withMessage('Gmail is required')
      .isEmail().withMessage('Gmail must be valid')
      .normalizeEmail(),

    body('oldPassword')
      .notEmpty().withMessage('Old password is required'),

    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

module.exports = {
    signupValidationRules,
    loginValidationRules,
    updatePasswordValidationRules
};

