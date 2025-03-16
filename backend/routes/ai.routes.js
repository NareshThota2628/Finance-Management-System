const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Protect all routes
router.use(authMiddleware);

// Rate limiting for AI endpoints
router.use(rateLimiter(5, 60)); // 5 requests per minute

// Get financial advice
router.post('/advice', aiController.getFinancialAdvice);

// Detect fraud
router.post('/detect-fraud', aiController.detectFraud);

// Predict future expenses
router.post('/predict-expenses', aiController.predictFutureExpenses);

module.exports = router;