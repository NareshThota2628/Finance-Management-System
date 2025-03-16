const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment.controller');
const authMiddleware = require('../middleware/auth');
const { validateRebalance } = require('../middleware/validation');

// Protect all routes
router.use(authMiddleware);

// Analyze portfolio
router.get('/analyze', investmentController.analyzePortfolio);

// Rebalance portfolio
router.post('/rebalance', validateRebalance, investmentController.rebalancePortfolio);

// Add new investment
router.post('/', investmentController.addInvestment);

// Remove investment
router.delete('/:investmentId', investmentController.removeInvestment);

module.exports = router;