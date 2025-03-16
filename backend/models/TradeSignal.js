const { admin } = require('../firebase-admin');

class TradeSignal {
  constructor({
    userId,
    asset,
    action, // buy/sell
    price,
    target,
    stopLoss,
    rationale,
    status = 'active',
    createdAt = admin.firestore.FieldValue.serverTimestamp()
  }) {
    this.userId = userId;
    this.asset = asset;
    this.action = action;
    this.price = price;
    this.target = target;
    this.stopLoss = stopLoss;
    this.rationale = rationale;
    this.status = status;
    this.createdAt = createdAt;
  }

  async save() {
    const docRef = await admin.firestore().collection('trade_signals').add({
      ...this.toJSON(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...this };
  }

  toJSON() {
    return {
      userId: this.userId,
      asset: this.asset,
      action: this.action,
      price: this.price,
      target: this.target,
      stopLoss: this.stopLoss,
      rationale: this.rationale,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}