const { VoiceCommand } = require('../models');
const voiceService = require('../services/voice.service');

module.exports = {
  handleVoiceCommand: async (req, res) => {
    try {
      const { commandText } = req.body;
      const { intent, entities, response } = await voiceService.processVoiceCommand(
        commandText,
        req.user.uid
      );

      // Log command
      const voiceCommand = new VoiceCommand({
        userId: req.user.uid,
        commandText,
        intent,
        entities,
        status: 'completed',
        response
      });
      await voiceCommand.save();

      res.json({
        success: true,
        intent,
        response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Voice command processing failed'
      });
    }
  },

  getCommandHistory: async (req, res) => {
    try {
      const snapshot = await admin.firestore().collection('voice_commands')
        .where('userId', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const commands = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));

      res.json({
        success: true,
        commands
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch command history'
      });
    }
  }
};