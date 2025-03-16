const { admin } = require('../firebase-admin');

class Transaction {
  constructor({
    amount,
    category,
    type,
    description,
    userId,
    date = admin.firestore.Timestamp.now(),
    merchant,
    location,
    status = 'pending',
    recurring = false
  }) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid transaction amount');
    }

    this.amount = amount;
    this.category = category;
    this.type = type; // income/expense
    this.description = description;
    this.userId = userId;
    this.date = date;
    this.merchant = merchant;
    this.location = location;
    this.status = status;
    this.recurring = recurring;
  }

  static async create(transactionData) {
    const transaction = new Transaction(transactionData);
    const docRef = await admin.firestore().collection('transactions').add({
      ...transaction.toJSON(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...transaction };
  }

  static async findByUser(userId, options = { limit: 100 }) {
    const query = admin.firestore().collection('transactions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(options.limit);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));
  }

  toJSON() {
    return {
      amount: this.amount,
      category: this.category,
      type: this.type,
      description: this.description,
      userId: this.userId,
      date: this.date,
      merchant: this.merchant,
      location: this.location,
      status: this.status,
      recurring: this.recurring
    };
  }
}