const { admin } = require('../firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

class User {
  constructor({
    uid,
    email,
    personalInfo = {},
    financialSettings = {},
    goals = [],
    createdAt = FieldValue.serverTimestamp(),
    updatedAt = FieldValue.serverTimestamp()
  }) {
    this.uid = uid;
    this.email = email;
    this.personalInfo = {
      firstName: personalInfo.firstName || '',
      lastName: personalInfo.lastName || '',
      age: personalInfo.age || null,
      currency: personalInfo.currency || 'USD'
    };
    this.financialSettings = {
      riskTolerance: financialSettings.riskTolerance || 'medium',
      investmentStrategy: financialSettings.investmentStrategy || 'balanced',
      alertPreferences: financialSettings.alertPreferences || {
        email: true,
        push: true
      }
    };
    this.goals = goals.map(goal => ({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline || null,
      status: 'active'
    }));
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async findById(uid) {
    const doc = await admin.firestore().collection('users').doc(uid).get();
    return doc.exists ? new User({ uid, ...doc.data() }) : null;
  }

  async save() {
    const userRef = admin.firestore().collection('users').doc(this.uid);
    await userRef.set({
      ...this.toJSON(),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    return this;
  }

  toJSON() {
    return {
      uid: this.uid,
      email: this.email,
      personalInfo: this.personalInfo,
      financialSettings: this.financialSettings,
      goals: this.goals,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Financial metrics
  async getNetWorth() {
    const snapshot = await admin.firestore().collection('investments')
      .where('userId', '==', this.uid)
      .get();
      
    return snapshot.docs.reduce((total, doc) => 
      total + doc.data().currentValue, 0);
  }
}