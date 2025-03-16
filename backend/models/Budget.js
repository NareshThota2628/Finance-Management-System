const { admin } = require('../firebase-admin');

class Budget {
  constructor({
    userId,
    category,
    limit,
    timeframe = 'monthly',
    notifications = true,
    rollover = false
  }) {
    this.userId = userId;
    this.category = category;
    this.limit = limit;
    this.timeframe = timeframe;
    this.notifications = notifications;
    this.rollover = rollover;
    this.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  async checkProgress() {
    const transactions = await Transaction.findByUser(this.userId, {
      filters: { 
        category: this.category,
        type: 'expense'
      }
    });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = this.limit - totalSpent;
    const utilization = (totalSpent / this.limit) * 100;

    return {
      totalSpent,
      remaining,
      utilization,
      status: utilization >= 90 ? 'over' : 'under'
    };
  }

  async save() {
    const docRef = await admin.firestore().collection('budgets').add({
      userId: this.userId,
      category: this.category,
      limit: this.limit,
      timeframe: this.timeframe,
      notifications: this.notifications,
      rollover: this.rollover,
      createdAt: this.createdAt
    });
    return { id: docRef.id, ...this };
  }
}