const { OpenAI } = require('openai');
const { Transaction } = require('../models');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

module.exports = {
  generateFinancialAdvice: async (transactions) => {
    const prompt = `Analyze these transactions and provide personalized advice in markdown:\n
    ${JSON.stringify(transactions.slice(0, 50))}\n
    Include budgeting tips, spending patterns, and savings opportunities.`;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error(`OpenAI Error: ${error.message}`);
      throw new Error('Failed to generate financial advice');
    }
  },

  detectFraudPatterns: async (transaction) => {
    const prompt = `Analyze transaction for fraud risk (respond as JSON only):
    Amount: $${transaction.amount}
    Merchant: ${transaction.merchant}
    Location: ${transaction.location}
    User's Typical Spending: ${transaction.userCategory}
    
    {
      "riskScore": 0-100,
      "isHighRisk": boolean,
      "reasons": string[]
    }`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error(`Fraud Detection Error: ${error.message}`);
      return { riskScore: 0, isHighRisk: false, reasons: [] };
    }
  }
};