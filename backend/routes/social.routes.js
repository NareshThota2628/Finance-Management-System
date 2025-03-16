const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const authMiddleware = require('../middleware/auth');
const { validateTradeSignal } = require('../middleware/validation');

// Protect all routes
router.use(authMiddleware);

// Post trade signal
router.post('/signal', validateTradeSignal, socialController.postTradeSignal);

// Follow trader
router.post('/follow/:traderId', socialController.followTrader);

// Get leaderboard
router.get('/leaderboard', socialController.getLeaderboard);

// Get trader profile
router.get('/trader/:traderId', socialController.getTraderProfile);

module.exports = router;