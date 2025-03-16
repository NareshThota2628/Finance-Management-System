const { Notification } = require('../models');

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.getUnread(req.user.uid);
      
      res.json({
        success: true,
        count: notifications.length,
        notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications'
      });
    }
  },

  createSystemNotification: async (req, res) => {
    try {
      const notification = await Notification.create({
        userId: req.user.uid,
        type: 'system',
        message: req.body.message,
        priority: 'high'
      });

      res.status(201).json({
        success: true,
        notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Notification creation failed'
      });
    }
  }
};