const { admin } = require('../firebase-admin');

class Notification {
  static async create({
    userId,
    type, // alert, reminder, achievement
    message,
    priority = 'medium',
    relatedEntity, // { type: 'transaction', id: 'abc123' }
    read = false
  }) {
    const notification = {
      userId,
      type,
      message,
      priority,
      relatedEntity,
      read,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
      )
    };

    const docRef = await admin.firestore().collection('notifications')
      .add(notification);
      
    return { id: docRef.id, ...notification };
  }

  static async markAsRead(notificationId) {
    await admin.firestore().collection('notifications')
      .doc(notificationId)
      .update({ read: true });
  }

  static async getUnread(userId) {
    const snapshot = await admin.firestore().collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  }
}