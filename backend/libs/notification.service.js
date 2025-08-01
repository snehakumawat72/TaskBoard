import Notification from "../models/notification.js";
import { getSocketIO } from "../socket/socket-server.js";

class NotificationService {
  // Google login welcome notification
  static async createLoginWelcomeNotification(userId, senderId, senderName) {
    // senderId and senderName are for compatibility, but not used here
    return this.createSimpleNotification({
      recipient: userId,
      type: 'login_welcome',
      title: '👋 Welcome!',
      message: `Welcome to the platform! You have successfully logged in with Google.`,
      senderName: senderName || 'System',
      taskName: null,
      projectName: null
    });
  }
  // Simple notification creation
  static async createSimpleNotification({ recipient, type, title, message, senderName, taskName, projectName }) {
    try {
      const notification = new Notification({
        userId: recipient,
        type,
        title,
        message,
        senderName,
        taskName,
        projectName,
        workspaceId: null
      });

      await notification.save();
      
      const savedNotification = await Notification.findById(notification._id).lean();
      
      // Transform for frontend
      const transformedNotification = {
        _id: savedNotification._id,
        type: savedNotification.type,
        title: savedNotification.title,
        message: savedNotification.message,
        timestamp: savedNotification.createdAt,
        read: savedNotification.isRead
      };

      // Real-time emission
      const io = getSocketIO();
      if (io) {
        console.log(`🔔 Emitting notification to user_${recipient}`);
        io.to(`user_${recipient}`).emit('new_notification', {
          notification: transformedNotification,
          unreadCount: await this.getUnreadCount(recipient)
        });
        console.log(`✅ Notification emitted successfully to room: user_${recipient}`);
      }

      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ userId, isRead: false });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Notification methods
  static async createTaskCreatedNotification(taskId, recipientId, senderId, senderName, taskName, projectName) {
    return this.createSimpleNotification({
      recipient: recipientId,
      type: 'task_created',
      title: '✨ New Task Created',
      message: `${senderName} created a new task "${taskName}" in ${projectName}. Check it out!`,
      senderName,
      taskName,
      projectName
    });
  }

  static async createTaskDeletedNotification(recipientId, senderId, senderName, taskName, projectName) {
    return this.createSimpleNotification({
      recipient: recipientId,
      type: 'task_deleted',
      title: '🗑️ Task Deleted',
      message: `${senderName} deleted task "${taskName}" from ${projectName}`,
      senderName,
      taskName,
      projectName
    });
  }

  static async createTaskCompletedNotification(taskId, recipientId, senderId, senderName, taskName, projectName) {
    return this.createSimpleNotification({
      recipient: recipientId,
      type: 'task_completed',
      title: '✅ Task Completed',
      message: `${senderName} completed task "${taskName}" in ${projectName}. Great job!`,
      senderName,
      taskName,
      projectName
    });
  }

  // Get notifications for a user
  static async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { userId };
      if (unreadOnly) query.isRead = false;
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });
      const transformedNotifications = notifications.map(n => ({
        _id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
        senderName: n.senderName,
        senderAvatar: n.senderAvatar,
        workspaceName: n.workspaceName,
        projectName: n.projectName,
        taskName: n.taskName,
        inviteId: n.inviteId,
        workspaceId: n.workspaceId
      }));
      return {
        notifications: transformedNotifications,
        unreadCount,
        totalCount: await Notification.countDocuments(query)
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );
      if (!notification) throw new Error('Notification not found');
      // Emit updated unread count
      const io = getSocketIO();
      if (io) {
        const newUnreadCount = await this.getUnreadCount(userId);
        io.to(`user_${userId.toString()}`).emit('unread_count_updated', { unreadCount: newUnreadCount });
      }
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      // Emit updated unread count
      const io = getSocketIO();
      if (io) {
        io.to(`user_${userId.toString()}`).emit('unread_count_updated', { unreadCount: 0 });
      }
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
      if (!notification) throw new Error('Notification not found');
      // Emit updated unread count if deleted notification was unread
      if (!notification.isRead) {
        const io = getSocketIO();
        if (io) {
          const newUnreadCount = await this.getUnreadCount(userId);
          io.to(`user_${userId.toString()}`).emit('unread_count_updated', { unreadCount: newUnreadCount });
        }
      }
      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export default NotificationService;
