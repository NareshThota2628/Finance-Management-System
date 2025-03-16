const { OpenAI } = require('openai');
const { Transaction, Budget } = require('../models');
const logger = require('../utils/logger');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = {
  processVoiceCommand: async (commandText, userId) => {
    try {
      // Intent recognition with function calling
      const intentResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: `Extract intent and entities from: "${commandText}"`
        }],
        functions: [{
          name: "process_financial_command",
          description: "Process financial voice commands",
          parameters: {
            type: "object",
            properties: {
              intent: {
                type: "string",
                enum: ["check_balance", "add_expense", "set_budget", "get_advice"]
              },
              amount: { type: "number" },
              category: { type: "string" }
            },
            required: ["intent"]
          }
        }]
      });

      const functionCall = intentResponse.choices[0].message.function_call;
      const { intent, amount, category } = JSON.parse(functionCall.arguments);

      let response;
      switch(intent) {
        case 'check_balance':
          const transactions = await Transaction.findByUser(userId);
          const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
          response = `Your current balance is $${balance.toFixed(2)}`;
          break;

        case 'add_expense':
          await Transaction.create({
            userId,
            amount: -Math.abs(amount),
            category,
            type: 'expense'
          });
          response = `Added expense of $${amount} for ${category}`;
          break;

        case 'set_budget':
          await Budget.create({
            userId,
            category,
            limit: amount,
            timeframe: 'monthly'
          });
          response = `Budget set for ${category}: $${amount} monthly`;
          break;

        default:
          response = 'Sorry, I didn\'t understand that command.';
      }

      return { intent, response };
    } catch (error) {
      logger.error(`Voice Processing Error: ${error.message}`);
      throw new Error('Failed to process voice command');
    }
  }
};