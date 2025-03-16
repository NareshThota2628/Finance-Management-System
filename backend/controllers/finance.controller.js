const { Transaction, FinancialHealth } = require('../models');
const plaid = require('../services/plaid.service');
const { predictCategory } = require('../services/ai.service');

module.exports = {
  linkBankAccount: async (req, res) => {
    try {
      const { publicToken } = req.body;
      const exchangeResponse = await plaid.exchangePublicToken(publicToken);
      
      // Store access token
      await admin.firestore().collection('users')
        .doc(req.user.uid)
        .update({ plaidAccessToken: exchangeResponse.access_token });

      // Initial transaction sync
      const transactions = await plaid.fetchTransactions(exchangeResponse.access_token);
      const categorizedTransactions = await Promise.all(
        transactions.map(async txn => ({
          ...txn,
          category: await predictCategory(txn.name)
        }))
      );

      // Batch write to Firestore
      const batch = admin.firestore().batch();
      categorizedTransactions.forEach(txn => {
        const ref = admin.firestore().collection('transactions').doc();
        batch.set(ref, { ...txn, userId: req.user.uid });
      });
      await batch.commit();

      res.json({
        success: true,
        syncedTransactions: categorizedTransactions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Bank connection failed'
      });
    }
  },

  analyzeSpending: async (req, res) => {
    try {
      const transactions = await Transaction.findByUser(req.user.uid);
      const analysis = {
        byCategory: {},
        monthlyTrends: {},
        biggestExpenses: []
      };

      // Categorize spending
      transactions.forEach(txn => {
        analysis.byCategory[txn.category] = 
          (analysis.byCategory[txn.category] || 0) + txn.amount;
      });

      // Calculate monthly trends
      transactions.forEach(txn => {
        const month = txn.date.toISOString().slice(0, 7);
        analysis.monthlyTrends[month] = 
          (analysis.monthlyTrends[month] || 0) + txn.amount;
      });

      // Identify top expenses
      analysis.biggestExpenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Update financial health score
      const score = await FinancialHealth.calculateScore(req.user.uid);

      res.json({
        success: true,
        analysis,
        financialHealth: score
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Spending analysis failed'
      });
    }
  }
};