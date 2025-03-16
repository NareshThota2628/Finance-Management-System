const { Transaction } = require('../models');
const { detectFraudPatterns } = require('./openai.service');
const logger = require('../utils/logger');

module.exports = {
  analyzeTransaction: async (transaction) => {
    try {
      // Basic rule-based checks
      const basicChecks = {
        isHighAmount: transaction.amount > 10000,
        isUnusualLocation: !transaction.userLocations.includes(transaction.location),
        isRapidSuccession: await this.checkRapidTransactions(transaction.userId)
      };

      // AI-based fraud detection
      const aiAnalysis = await detectFraudPatterns(transaction);

      // Combine results
      const fraudScore = (
        (basicChecks.isHighAmount ? 30 : 0) +
        (basicChecks.isUnusualLocation ? 20 : 0) +
        (basicChecks.isRapidSuccession ? 10 : 0) +
        aiAnalysis.riskScore
      );

      return {
        fraudScore,
        isHighRisk: fraudScore > 70,
        reasons: [
          ...(basicChecks.isHighAmount ? ['High transaction amount'] : []),
          ...(basicChecks.isUnusualLocation ? ['Unusual location'] : []),
          ...(basicChecks.isRapidSuccession ? ['Rapid transactions'] : []),
          ...aiAnalysis.reasons
        ]
      };
    } catch (error) {
      logger.error(`Fraud Analysis Error: ${error.message}`);
      throw new Error('Failed to analyze transaction for fraud');
    }
  },

  checkRapidTransactions: async (userId) => {
    try {
      const recentTransactions = await Transaction.findByUser(userId, {
        limit: 5,
        filters: { date: { $gt: new Date(Date.now() - 5 * 60 * 1000) } } // Last 5 minutes
      });

      return recentTransactions.length >= 3;
    } catch (error) {
      logger.error(`Rapid Transaction Check Error: ${error.message}`);
      return false;
    }
  },

  blockTransaction: async (transactionId) => {
    try {
      await admin.firestore().collection('transactions')
        .doc(transactionId)
        .update({ status: 'blocked' });

      logger.info(`Blocked transaction: ${transactionId}`);
    } catch (error) {
      logger.error(`Block Transaction Error: ${error.message}`);
      throw new Error('Failed to block transaction');
    }
  }
};