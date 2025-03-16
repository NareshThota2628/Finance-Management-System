const { Budget, Transaction } = require('../models');

module.exports = {
  createBudget: async (req, res) => {
    try {
      const budget = new Budget({
        userId: req.user.uid,
        ...req.body
      });
      
      const savedBudget = await budget.save();
      
      res.status(201).json({
        success: true,
        budget: savedBudget
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Budget creation failed'
      });
    }
  },

  getBudgetProgress: async (req, res) => {
    try {
      const budgets = await admin.firestore().collection('budgets')
        .where('userId', '==', req.user.uid)
        .get();

      const progressReports = await Promise.all(
        budgets.docs.map(async doc => {
          const budget = new Budget(doc.data());
          return {
            ...doc.data(),
            progress: await budget.checkProgress()
          };
        })
      );

      res.json({
        success: true,
        budgets: progressReports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Budget analysis failed'
      });
    }
  }
};