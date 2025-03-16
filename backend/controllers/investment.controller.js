const { Investment, User } = require('../models');

module.exports = {
  analyzePortfolio: async (req, res) => {
    try {
      const investments = await admin.firestore().collection('investments')
        .where('userId', '==', req.user.uid)
        .get();

      const portfolioAnalysis = await Promise.all(
        investments.docs.map(async doc => {
          const investment = new Investment(doc.data());
          return {
            ...doc.data(),
            performance: await investment.calculatePerformance()
          };
        })
      );

      const totalValue = portfolioAnalysis.reduce(
        (sum, inv) => sum + inv.currentValue, 0);
      
      const user = await User.findById(req.user.uid);
      const netWorth = await user.getNetWorth();

      res.json({
        success: true,
        portfolio: portfolioAnalysis,
        allocationPercentage: (totalValue / netWorth) * 100
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Portfolio analysis failed'
      });
    }
  },

  rebalancePortfolio: async (req, res) => {
    try {
      const { allocations } = req.body; // { stock: 60, bonds: 30, crypto: 10 }
      const totalPercentage = Object.values(allocations).reduce((a, b) => a + b);
      
      if(totalPercentage !== 100) {
        throw new Error('Invalid allocation percentages');
      }

      const user = await User.findById(req.user.uid);
      const netWorth = await user.getNetWorth();
      
      const batch = admin.firestore().batch();
      
      Object.entries(allocations).forEach(([type, percentage]) => {
        const ref = admin.firestore().collection('investments')
          .where('userId', '==', req.user.uid)
          .where('type', '==', type);
          
        batch.update(ref, {
          currentValue: netWorth * (percentage / 100)
        });
      });

      await batch.commit();

      res.json({
        success: true,
        newAllocations: allocations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Rebalance failed'
      });
    }
  }
};