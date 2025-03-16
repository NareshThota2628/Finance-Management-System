const { admin } = require('../firebase-admin');
const { TradeSignal } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  createTradeSignal: async (signalData) => {
    try {
      const signal = new TradeSignal(signalData);
      const savedSignal = await signal.save();
      
      // Publish to followers
      const followers = await admin.firestore().collection('social_connections')
        .where('following', 'array-contains', signalData.userId)
        .get();

      const batch = admin.firestore().batch();
      followers.docs.forEach(doc => {
        const notificationRef = admin.firestore().collection('notifications').doc();
        batch.set(notificationRef, {
          userId: doc.id,
          type: 'trade_signal',
          message: `New trade signal from ${signalData.userId}`,
          data: savedSignal,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      return savedSignal;
    } catch (error) {
      logger.error(`Social Service Error: ${error.message}`);
      throw new Error('Failed to create trade signal');
    }
  },

  getLeaderboard: async () => {
    try {
      const snapshot = await admin.firestore().collection('users')
        .orderBy('performanceScore', 'desc')
        .limit(10)
        .get();

      return snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
        performanceScore: doc.data().performanceScore.toFixed(2)
      }));
    } catch (error) {
      logger.error(`Leaderboard Error: ${error.message}`);
      throw new Error('Failed to fetch leaderboard');
    }
  }
};