const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Protect all routes
router.use(authMiddleware);

// Rate limiting for voice endpoints
router.use(rateLimiter(15, 60)); // 15 requests per minute

// Handle voice command
router.post('/command', voiceController.handleVoiceCommand);

// Get command history
router.get('/history', voiceController.getCommandHistory);

module.exports = router;