const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Password reset endpoints
router.post('/send-reset-password-token', authController.sendResetPasswordToken);
router.post('/reset-password', authController.resetPassword);

module.exports = router; 