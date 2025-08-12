import NotificationService from "../libs/notification.service.js";

export const getNotifications = async (req, res) => {
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

export const markAsRead = async (req, res) => {
  try {
    
    console.log('Marking notification as read:', req.params.id);
    if (!req.params.id ) {
      return res.status(400).json({ success: false, message: 'Notification ID is required' });
    }
    await NotificationService.markAsRead(req.params.id);
    // await NotificationService.markAsRead(req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await NotificationService.deleteNotification(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
};
