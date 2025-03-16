const { admin } = require('../firebase-admin');

class Investment {
  constructor({
    userId,
    type, // stocks, bonds, crypto, real_estate
    initialAmount,
    currentValue,
    startDate = admin.firestore.Timestamp.now(),
    riskLevel = 'medium',
    expectedReturn,
    portfolioPercentage
  }) {
    this.userId = userId;
    this.type = type;
    this.initialAmount = initialAmount;
    this.currentValue = currentValue;
    this.startDate = startDate;
    this.riskLevel = riskLevel;
    this.expectedReturn = expectedReturn;
    this.portfolioPercentage = portfolioPercentage;
  }

  async calculatePerformance() {
    const duration = (admin.firestore.Timestamp.now().toDate() - 
      this.startDate.toDate()) / (1000 * 60 * 60 * 24 * 365);
      
    return {
      absoluteReturn: this.currentValue - this.initialAmount,
      annualizedReturn: ((this.currentValue / this.initialAmount) ** 
        (1 / duration) - 1) * 100,
      sharpeRatio: this._calculateSharpeRatio()
    };
  }

  _calculateSharpeRatio() {
    // Advanced risk-adjusted return calculation
  }

  async rebalancePortfolio(newPercentage) {
    const totalPortfolio = await User.findById(this.userId)
      .then(user => user.getNetWorth());
      
    this.currentValue = totalPortfolio * (newPercentage / 100);
    await this.save();
  }

  async save() {
    const docRef = await admin.firestore().collection('investments').add({
      ...this.toJSON(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...this };
  }
}