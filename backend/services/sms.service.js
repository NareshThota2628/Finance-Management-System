const twilio = require('twilio');
const logger = require('../utils/logger');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  sendSMS: async (to, message) => {
    try {
      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      logger.info(`SMS sent to ${to}: ${response.sid}`);
      return response.sid;
    } catch (error) {
      logger.error(`SMS Error: ${error.message}`);
      throw new Error('Failed to send SMS');
    }
  },

  sendOTP: async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const message = `Your FinanceAI OTP is: ${otp}`;

    try {
      await this.sendSMS(phoneNumber, message);
      return otp;
    } catch (error) {
      logger.error(`OTP Error: ${error.message}`);
      throw new Error('Failed to send OTP');
    }
  },

  sendFraudAlert: async (phoneNumber, transaction) => {
    const message = `Fraud Alert: Suspicious transaction of $${transaction.amount} at ${transaction.merchant}. Reply STOP to unsubscribe.`;
    return this.sendSMS(phoneNumber, message);
  }
};