const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get notifications
router.get('/', notificationController.getNotifications);

// Mark as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// Create system notification
router.post('/system', notificationController.createSystemNotification);

module.exports = router;