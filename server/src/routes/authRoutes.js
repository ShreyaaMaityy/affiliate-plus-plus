const express = require('express');
const authController = require('../controller/authController');
const router = express.Router(); // Instance of Router
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const loginValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Username must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be atleast 4 characters long')
];

// Rate limiter for password reset (5 requests per hour per IP)
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { message: 'Too many reset requests from this IP, please try again after an hour.' }
});

router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/is-user-logged-in', authController.isUserLoggedIn);
router.post('/register', authController.register);
router.post('/google-auth', authController.googleAuth);
router.post('/send-reset-password-token', resetLimiter, authController.sendResetPasswordToken);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
