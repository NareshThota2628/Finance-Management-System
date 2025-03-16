const { Investment, User } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  calculatePortfolioPerformance: async (userId) => {
    try {
      const investments = await Investment.findByUser(userId);
      const user = await User.findById(userId);

      const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
      const netWorth = await user.getNetWorth();

      const performance = await Promise.all(
        investments.map(async inv => ({
          ...inv,
          performance: await inv.calculatePerformance()
        }))
      );

      return {
        totalValue,
        allocationPercentage: (totalValue / netWorth) * 100,
        performance
      };
    } catch (error) {
      logger.error(`Portfolio Performance Error: ${error.message}`);
      throw new Error('Failed to calculate portfolio performance');
    }
  },

  rebalancePortfolio: async (userId, allocations) => {
    try {
      const user = await User.findById(userId);
      const netWorth = await user.getNetWorth();

      const batch = admin.firestore().batch();
      Object.entries(allocations).forEach(([type, percentage]) => {
        const ref = admin.firestore().collection('investments')
          .where('userId', '==', userId)
          .where('type', '==', type);
          
        batch.update(ref, {
          currentValue: netWorth * (percentage / 100)
        });
      });

      await batch.commit();
      logger.info(`Rebalanced portfolio for user: ${userId}`);
    } catch (error) {
      logger.error(`Rebalance Error: ${error.message}`);
      throw new Error('Failed to rebalance portfolio');
    }
  },

  suggestInvestments: async (userId) => {
    try {
      const user = await User.findById(userId);
      const riskProfile = user.financialSettings.riskTolerance;

      // Example: Fetch investment suggestions based on risk profile
      const suggestions = {
        low: [
          { type: 'bonds', allocation: 70 },
          { type: 'stocks', allocation: 30 }
        ],
        medium: [
          { type: 'stocks', allocation: 60 },
          { type: 'crypto', allocation: 20 },
          { type: 'bonds', allocation: 20 }
        ],
        high: [
          { type: 'crypto', allocation: 50 },
          { type: 'stocks', allocation: 40 },
          { type: 'real_estate', allocation: 10 }
        ]
      };

      return suggestions[riskProfile] || [];
    } catch (error) {
      logger.error(`Investment Suggestion Error: ${error.message}`);
      throw new Error('Failed to generate investment suggestions');
    }
  }
};