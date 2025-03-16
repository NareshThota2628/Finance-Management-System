const { Budget, Transaction } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  calculateBudgetProgress: async (userId) => {
    try {
      const budgets = await Budget.findByUser(userId);
      const transactions = await Transaction.findByUser(userId);

      const progressReports = await Promise.all(
        budgets.map(async budget => {
          const categorySpending = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            ...budget,
            spent: categorySpending,
            remaining: budget.limit - categorySpending,
            utilization: (categorySpending / budget.limit) * 100
          };
        })
      );

      return progressReports;
    } catch (error) {
      logger.error(`Budget Progress Error: ${error.message}`);
      throw new Error('Failed to calculate budget progress');
    }
  },

  suggestBudgetAdjustments: async (userId) => {
    try {
      const budgets = await this.calculateBudgetProgress(userId);
      const suggestions = budgets.map(budget => ({
        category: budget.category,
        currentLimit: budget.limit,
        suggestedLimit: budget.limit * (budget.utilization > 90 ? 1.1 : 0.9),
        reason: budget.utilization > 90 
          ? 'High utilization, consider increasing limit' 
          : 'Low utilization, consider reducing limit'
      }));

      return suggestions;
    } catch (error) {
      logger.error(`Budget Adjustment Error: ${error.message}`);
      throw new Error('Failed to suggest budget adjustments');
    }
  },

  createBudget: async (userId, budgetData) => {
    try {
      const budget = new Budget({
        userId,
        ...budgetData
      });

      const savedBudget = await budget.save();
      logger.info(`Created budget for user: ${userId}`);
      return savedBudget;
    } catch (error) {
      logger.error(`Budget Creation Error: ${error.message}`);
      throw new Error('Failed to create budget');
    }
  }
};