const plaid = require('plaid');
const { Transaction } = require('../models');
const logger = require('../utils/logger');

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
  options: { version: '2020-09-14' }
});

const MAX_RETRIES = 3;

module.exports = {
  exchangePublicToken: async (publicToken) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await client.exchangePublicToken(publicToken);
        return {
          accessToken: response.access_token,
          itemId: response.item_id
        };
      } catch (error) {
        if (attempt === MAX_RETRIES) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  },

  fetchTransactions: async (accessToken, startDate, endDate) => {
    try {
      const response = await client.getTransactions(
        accessToken,
        startDate,
        endDate,
        { count: 500 }
      );
      
      return response.transactions.map(txn => 
        new Transaction({
          amount: txn.amount,
          date: txn.date,
          category: txn.category?.[0] || 'Uncategorized',
          description: txn.name
        })
      );
    } catch (error) {
      logger.error(`Plaid Error: ${error.message}`);
      throw new Error('Failed to fetch transactions');
    }
  },

  createLinkToken: async (userId) => {
    const response = await client.createLinkToken({
      user: { client_user_id: userId },
      client_name: 'FinanceAI',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
    });
    
    return response.link_token;
  }
};