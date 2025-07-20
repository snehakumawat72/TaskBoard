// backend/controllers/notificationController.js

import NotificationService from '../libs/notification-service.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notificationsData = await NotificationService.getUserNotifications(
      req.user._id,
      req.query
    );
    res.status(200).json({ success: true, data: notificationsData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};