const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const rateLimiter = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Rate limiting for auth endpoints
router.use(rateLimiter(10, 60)); // 10 requests per minute

// Register new user
router.post('/register', validateRegister, authController.registerUser);

// Login user
router.post('/login', validateLogin, authController.loginUser);

// Password reset
router.post('/forgot-password', authController.forgotPassword);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;