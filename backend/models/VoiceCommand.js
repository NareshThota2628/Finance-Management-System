const { admin } = require('../firebase-admin');

class VoiceCommand {
  constructor({
    userId,
    commandText,
    intent,
    entities = {},
    status = 'pending',
    response = null,
    createdAt = admin.firestore.FieldValue.serverTimestamp()
  }) {
    this.userId = userId;
    this.commandText = commandText;
    this.intent = intent;
    this.entities = entities;
    this.status = status;
    this.response = response;
    this.createdAt = createdAt;
  }

  async save() {
    const docRef = await admin.firestore().collection('voice_commands').add({
      ...this.toJSON(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...this };
  }

  toJSON() {
    return {
      userId: this.userId,
      commandText: this.commandText,
      intent: this.intent,
      entities: this.entities,
      status: this.status,
      response: this.response,
      createdAt: this.createdAt
    };
  }
}