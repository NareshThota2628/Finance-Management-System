const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const authMiddleware = require('../middleware/auth');
const { validateLinkBank, validateSpendingAnalysis } = require('../middleware/validation');

// Protect all routes
router.use(authMiddleware);

// Link bank account
router.post('/link-account', validateLinkBank, financeController.linkBankAccount);

// Analyze spending
router.get('/analyze-spending', validateSpendingAnalysis, financeController.analyzeSpending);

// Fetch transactions
router.get('/transactions', financeController.getTransactions);

// Export financial data
router.get('/export', financeController.exportFinancialData);

module.exports = router;