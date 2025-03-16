const socialService = require('../services/social.service');

module.exports = {
  postTradeSignal: async (req, res) => {
    try {
      const signal = await socialService.createTradeSignal({
        userId: req.user.uid,
        ...req.body
      });

      res.status(201).json({
        success: true,
        signal
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to post trade signal'
      });
    }
  },

  followTrader: async (req, res) => {
    try {
      await socialService.followTrader(req.user.uid, req.params.traderId);
      
      res.json({
        success: true,
        message: `Now following trader ${req.params.traderId}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to follow trader'
      });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await socialService.getLeaderboard();
      
      res.json({
        success: true,
        leaderboard
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard'
      });
    }
  }
};