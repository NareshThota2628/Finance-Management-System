const { generateFinancialAdvice, detectFraudPatterns } = require('../services/openai.service');
const { Transaction } = require('../models');
const { Prophet } = require('prophet-js');

module.exports = {
  getFinancialAdvice: async (req, res) => {
    try {
      const transactions = await Transaction.findByUser(req.user.uid);
      const advice = await generateFinancialAdvice(transactions);
      
      res.json({
        success: true,
        advice,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'AI analysis failed'
      });
    }
  },

  detectFraud: async (req, res) => {
    try {
      const transactions = await Transaction.findByUser(req.user.uid);
      const fraudReports = await Promise.all(
        transactions.map(t => detectFraudPatterns(t))
      );

      const suspicious = fraudReports.filter(r => r.isFraud);
      
      if(suspicious.length > 0) {
        await admin.firestore().collection('alerts')
          .doc(req.user.uid)
          .set({ fraudAttempts: suspicious }, { merge: true });
      }

      res.json({
        success: true,
        totalTransactions: transactions.length,
        suspiciousCount: suspicious.length,
        reports: fraudReports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Fraud detection failed'
      });
    }
  },

  predictFutureExpenses: async (req, res) => {
    try {
      const transactions = await Transaction.findByUser(req.user.uid);
      const prophet = new Prophet({
        growth: 'logistic',
        seasonalityMode: 'multiplicative'
      });

      // Prepare time series data
      const data = transactions.map(t => ({
        ds: t.date.toISOString(),
        y: t.amount
      }));

      // Train model
      prophet.fit(data);
      
      // Predict next 30 days
      const future = prophet.makeFutureDataframe({ periods: 30 });
      const forecast = prophet.predict(future);

      res.json({
        success: true,
        forecast: forecast.map(f => ({
          date: f.ds,
          predictedAmount: f.yhat,
          upperBound: f.yhat_upper,
          lowerBound: f.yhat_lower
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Prediction failed'
      });
    }
  }
};