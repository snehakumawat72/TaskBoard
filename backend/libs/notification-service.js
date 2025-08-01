import Notification from "../models/notification.js";
import User from "../models/user.js";
import Workspace from "../models/workspace.js";
import { sendEmail } from "./send-email.js"; 
import { getSocketIO } from "../socket/socket-server.js"; // We'll create this

class NotificationService {
  // Create a new notification with real-time emission
  static async createNotification({
    recipient,
    type,
    title,
    message,
    sender = null,
    workspace = null,
    project = null,
    task = null,
    inviteId = null,
    actionUrl = null,
    metadata = {},
    // Direct name parameters for better control
    senderName = null,
    senderAvatar = null,
    workspaceName = null,
    projectName = null,
    taskName = null
  }) {
    try {
      const notification = new Notification({
        userId: recipient,
        type,
        title,
        message,
        senderName: senderName || sender?.name,
        senderAvatar: senderAvatar || sender?.profilePicture,
        workspaceName: workspaceName || workspace?.name,
        projectName: projectName || project?.title,
        taskName: taskName || task?.title,
        inviteId,
        workspaceId: workspace?._id || workspace
      });

      await notification.save();
      
      // Get the saved notification (no population needed since we store the data directly)
      const savedNotification = await Notification.findById(notification._id).lean();

      // Transform for frontend
      const transformedNotification = {
        _id: savedNotification._id,
        type: savedNotification.type,
        title: savedNotification.title,
        message: savedNotification.message,
        isRead: savedNotification.isRead,
        createdAt: savedNotification.createdAt,
        senderName: savedNotification.senderName,
        senderAvatar: savedNotification.senderAvatar,
        workspaceName: savedNotification.workspaceName,
        projectName: savedNotification.projectName,
        taskName: savedNotification.taskName,
        inviteId: savedNotification.inviteId,
        workspaceId: savedNotification.workspaceId
      };

      // Emit real-time notification
      try {
        const io = getSocketIO();
        if (io) {
          console.log(`🔔 Emitting notification to user_${recipient.toString()}`);
          console.log(`📡 Notification data being emitted:`, {
            notification: transformedNotification,
            unreadCount: await this.getUnreadCount(recipient)
          });
          
          // Check if user is connected to socket
          const userRoom = `user_${recipient.toString()}`;
          const socketsInRoom = await io.in(userRoom).fetchSockets();
          console.log(`👥 Sockets in room ${userRoom}:`, socketsInRoom.length);
          
          io.to(userRoom).emit('new_notification', {
            notification: transformedNotification,
            unreadCount: await this.getUnreadCount(recipient)
          });
          console.log(`✅ Notification emitted successfully to room: ${userRoom}`);
        } else {
          console.log('❌ Socket.IO instance not available');
        }
      } catch (socketError) {
        console.log('❌ Failed to emit notification via socket:', socketError.message);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get unread count helper
  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        userId: userId,
        isRead: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const skip = (page - 1) * limit;
      
      const query = { userId: userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const unreadCount = await Notification.countDocuments({
        userId: userId,
        isRead: false
      });

      // Transform notifications to match frontend interface (no population needed)
      const transformedNotifications = notifications.map(notification => ({
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        senderName: notification.senderName,
        senderAvatar: notification.senderAvatar,
        workspaceName: notification.workspaceName,
        projectName: notification.projectName,
        taskName: notification.taskName,
        inviteId: notification.inviteId,
        workspaceId: notification.workspaceId
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

  // Mark notification as read with real-time update
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId: userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Emit updated unread count
      const io = getSocketIO();
      if (io) {
        const newUnreadCount = await this.getUnreadCount(userId);
        io.to(`user_${userId.toString()}`).emit('unread_count_updated', {
          unreadCount: newUnreadCount
        });
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read with real-time update
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId: userId, isRead: false },
        { isRead: true }
      );

      // Emit updated unread count
      const io = getSocketIO();
      if (io) {
        io.to(`user_${userId.toString()}`).emit('unread_count_updated', {
          unreadCount: 0
        });
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
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Emit updated unread count if deleted notification was unread
      if (!notification.isRead) {
        const io = getSocketIO();
        if (io) {
          const newUnreadCount = await this.getUnreadCount(userId);
          io.to(`user_${userId.toString()}`).emit('unread_count_updated', {
            unreadCount: newUnreadCount
          });
        }
      }

      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }



static async createWorkspaceInviteNotification(inviteId, recipientId, senderId, senderName, workspaceName) {
  // 1. Create the in-app notification first
  const notification = await this.createNotification({
    recipient: recipientId,
    type: "workspace_invite",
    title: "Workspace Invitation",
    message: `${senderName} invited you to join the "${workspaceName}" workspace`,
    sender: senderId,
    inviteId: inviteId,
    // The actionUrl should be a relative path for in-app navigation
    actionUrl: `/workspaces/invites/${inviteId}`
  });

  // 2. Find the user to get their email
  const user = await User.findById(recipientId);

  // 3. Send the email if the user exists and has an email address
  if (user && user.email) {
    // Use the environment variable for the link's base URL
    const inviteLink = `${process.env.FRONTEND_URL}/workspaces/invites/${inviteId}`;

    const emailHtml = `
      <p>Hi ${user.name || 'there'},</p>
      <p><strong>${senderName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> on TaskBoard.</p>
      <p>You can accept by clicking the link below:</p>
      <p><a href="${inviteLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Accept Invite</a></p>
      <p>This invite will expire in 7 days.</p>
    `;

    const emailSent = await sendEmail(
      user.email,
      `You've been invited to join "${workspaceName}" on TaskBoard`,
      emailHtml
    );

    // If the email fails to send, throw an error to notify the controller
    if (!emailSent) {
      // This will be caught by the main controller and sent to the frontend
      throw new Error('Failed to send the invitation email.');
    }
  }

  return notification;
}


  static async createTaskAssignedNotification(taskId, recipientId, senderId, senderName, taskName, projectName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'task_assigned',
      title: '📋 Task Assigned',
      message: `${senderName} assigned you to task "${taskName}" in ${projectName}`,
      sender: senderId,
      task: taskId,
      actionUrl: `/tasks/${taskId}`,
      senderName: senderName,
      taskName: taskName,
      projectName: projectName
    });
  }

  static async createTaskCompletedNotification(taskId, recipientId, senderId, senderName, taskName, projectName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'task_completed',
      title: 'Task Completed',
      message: `${senderName} completed task "${taskName}" in ${projectName}`,
      sender: senderId,
      task: taskId,
      actionUrl: `/tasks/${taskId}`
    });
  }

  // Enhanced project update notification
  static async createProjectUpdatedNotification(projectId, recipientId, senderId, senderName, projectName, updateType) {
    return this.createNotification({
      recipient: recipientId,
      type: 'project_updated',
      title: '📊 Project Updated',
      message: `${senderName} ${updateType} project "${projectName}". Check out the latest changes!`,
      sender: senderId,
      project: projectId,
      actionUrl: `/projects/${projectId}`,
      senderName: senderName,
      projectName: projectName
    });
  }

  // Enhanced member joined notification
  static async createMemberJoinedNotification(workspaceId, recipientId, memberName, workspaceName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'member_joined',
      title: '👋 New Team Member!',
      message: `${memberName} has joined the "${workspaceName}" workspace. Welcome them to the team!`,
      workspace: workspaceId,
      actionUrl: `/workspaces/${workspaceId}/members`,
      workspaceName: workspaceName
    });
  }

  static async createDeadlineReminderNotification(taskId, recipientId, taskName, deadline) {
    return this.createNotification({
      recipient: recipientId,
      type: 'deadline_reminder',
      title: 'Deadline Reminder',
      message: `Task "${taskName}" is due on ${new Date(deadline).toLocaleDateString()}`,
      task: taskId,
      actionUrl: `/tasks/${taskId}`
    });
  }

  static async createCommentAddedNotification(taskId, recipientId, senderId, senderName, taskName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'comment_added',
      title: 'New Comment',
      message: `${senderName} added a comment to task "${taskName}"`,
      sender: senderId,
      task: taskId,
      actionUrl: `/tasks/${taskId}`
    });
  }

  // Enhanced login welcome notification
  static async createLoginWelcomeNotification(userId, userName, loginTime = new Date()) {
    const timeString = loginTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const dateString = loginTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return this.createNotification({
      recipient: userId,
      type: 'login_welcome',
      title: '🎉 Welcome Back!',
      message: `Hello ${userName}! You successfully logged in on ${dateString} at ${timeString}. Hope you have a productive day ahead!`,
      actionUrl: '/dashboard',
      senderName: userName,
      metadata: { 
        loginTime: loginTime.toISOString(),
        welcomeType: 'login_success'
      }
    });
  }

  // Email notification
  static async createEmailNotification(userId, emailType, subject, details = '') {
    return this.createNotification({
      recipient: userId,
      type: 'email_notification',
      title: 'Email Sent',
      message: `${emailType}: ${subject}${details ? ` - ${details}` : ''}`,
      actionUrl: '/dashboard/notifications',
      metadata: { emailType, subject, details }
    });
  }

  // Enhanced dashboard update notification with specific details
  static async createDashboardUpdateNotification(userId, updateType, details, actionUrl = '/dashboard') {
    return this.createNotification({
      recipient: userId,
      type: 'dashboard_update',
      title: 'Dashboard Update',
      message: `${updateType}: ${details}`,
      actionUrl: actionUrl,
      metadata: { updateType, details }
    });
  }

  // Enhanced task creation notification
  static async createTaskCreatedNotification(taskId, recipientId, senderId, senderName, taskName, projectName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'task_created',
      title: '✨ New Task Created',
      message: `${senderName} created a new task "${taskName}" in ${projectName}. Check it out!`,
      sender: senderId,
      task: taskId,
      actionUrl: `/tasks/${taskId}`,
      senderName: senderName,
      taskName: taskName,
      projectName: projectName
    });
  }

  // Enhanced task update notification
  static async createTaskUpdatedNotification(taskId, recipientId, senderId, senderName, taskName, updateType) {
    return this.createNotification({
      recipient: recipientId,
      type: 'task_updated',
      title: '📝 Task Updated',
      message: `${senderName} ${updateType} task "${taskName}". Stay updated with the latest changes!`,
      sender: senderId,
      task: taskId,
      actionUrl: `/tasks/${taskId}`,
      senderName: senderName,
      taskName: taskName
    });
  }

  // Enhanced task deletion notification
  static async createTaskDeletedNotification(recipientId, senderId, senderName, taskName, projectName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'task_deleted',
      title: '🗑️ Task Deleted',
      message: `${senderName} deleted task "${taskName}" from ${projectName}`,
      sender: senderId,
      actionUrl: '/dashboard',
      senderName: senderName,
      taskName: taskName,
      projectName: projectName
    });
  }

  // Enhanced project creation notification
  static async createProjectCreatedNotification(projectId, recipientId, senderId, senderName, projectName, workspaceName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'project_created',
      title: '🚀 New Project Created',
      message: `${senderName} created a new project "${projectName}" in ${workspaceName}. Let's get started!`,
      sender: senderId,
      project: projectId,
      actionUrl: `/projects/${projectId}`,
      senderName: senderName,
      projectName: projectName,
      workspaceName: workspaceName
    });
  }

  // Enhanced project deletion notification
  static async createProjectDeletedNotification(recipientId, senderId, senderName, projectName, workspaceName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'project_deleted',
      title: '📁 Project Deleted',
      message: `${senderName} deleted project "${projectName}" from ${workspaceName}`,
      sender: senderId,
      actionUrl: '/dashboard',
      senderName: senderName,
      projectName: projectName,
      workspaceName: workspaceName
    });
  }

  // Project deletion notification
  static async createProjectDeletedNotification(recipientId, senderId, senderName, projectName, workspaceName) {
    return this.createNotification({
      recipient: recipientId,
      type: 'project_deleted',
      title: 'Project Deleted',
      message: `${senderName} deleted project "${projectName}" from ${workspaceName}`,
      sender: senderId,
      actionUrl: '/dashboard'
    });
  }

  // Bulk notification creation for workspace members
  static async createBulkNotifications(notifications) {
    try {
      const createdNotifications = await Notification.insertMany(notifications);
      
      // Group notifications by recipient for efficient socket emission
      const notificationsByRecipient = {};
      for (const notification of createdNotifications) {
        const recipientId = notification.recipient.toString();
        if (!notificationsByRecipient[recipientId]) {
          notificationsByRecipient[recipientId] = [];
        }
        notificationsByRecipient[recipientId].push(notification);
      }

      // Emit notifications to each recipient
      const io = getSocketIO();
      if (io) {
        for (const [recipientId, userNotifications] of Object.entries(notificationsByRecipient)) {
          const unreadCount = await this.getUnreadCount(recipientId);
          
          // Populate and transform notifications
          const populatedNotifications = await Notification.find({
            _id: { $in: userNotifications.map(n => n._id) }
          })
          .populate('sender', 'name email profilePicture')
          .populate('workspace', 'name')
          .populate('project', 'name')
          .populate('task', 'title')
          .lean();

          const transformedNotifications = populatedNotifications.map(notification => ({
            _id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            actionUrl: notification.actionUrl,
            senderName: notification.sender?.name,
            senderAvatar: notification.sender?.profilePicture,
            workspaceName: notification.workspace?.name,
            projectName: notification.project?.name,
            taskName: notification.task?.title,
            inviteId: notification.inviteId,
            workspaceId: notification.workspace?._id
          }));

          // Emit each notification
          transformedNotifications.forEach(notification => {
            io.to(`user_${recipientId}`).emit('new_notification', {
              notification,
              unreadCount
            });
          });
        }
      }

      return createdNotifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Clean up old notifications
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true
      });

      return result;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  // ========== ENHANCED NOTIFICATION TYPES ==========

  static async createTaskCompletedNotification(taskId, completedByUserId, assigneeId, taskTitle, projectName = null) {
    try {
      const completedBy = await User.findById(completedByUserId).select('name profilePicture');
      return await this.createNotification({
        recipient: assigneeId,
        type: 'task_completed',
        title: 'Task Completed',
        message: `${completedBy?.name || 'Someone'} completed task: "${taskTitle}"${projectName ? ` in project ${projectName}` : ''}`,
        sender: completedBy,
        task: taskId,
        actionUrl: `/tasks/${taskId}`,
        metadata: {
          taskId,
          completedByUserId,
          projectName,
          notificationType: 'task_completed'
        }
      });
    } catch (error) {
      console.error('Error creating task completed notification:', error);
      throw error;
    }
  }

  static async createTaskDueSoonNotification(taskId, assigneeId, taskTitle, dueDate, projectName = null) {
    try {
      const timeUntilDue = new Date(dueDate) - new Date();
      const hoursUntilDue = Math.floor(timeUntilDue / (1000 * 60 * 60));
      
      return await this.createNotification({
        recipient: assigneeId,
        type: 'task',
        title: 'Task Due Soon',
        message: `Task "${taskTitle}" is due in ${hoursUntilDue} hours${projectName ? ` in project ${projectName}` : ''}`,
        task: taskId,
        actionUrl: `/tasks/${taskId}`,
        metadata: {
          taskId,
          dueDate,
          projectName,
          notificationType: 'task_due_soon'
        }
      });
    } catch (error) {
      console.error('Error creating task due soon notification:', error);
      throw error;
    }
  }

  // Project-related notifications
  static async createProjectCreatedNotification(projectId, creatorId, teamMemberIds, projectName, workspaceName = null) {
    try {
      const creator = await User.findById(creatorId).select('name');
      const notifications = [];

      for (const memberId of teamMemberIds) {
        if (memberId.toString() !== creatorId.toString()) {
          const notification = await this.createNotification({
            recipient: memberId,
            type: 'project',
            title: 'New Project Created',
            message: `${creator?.name || 'Someone'} created project "${projectName}"${workspaceName ? ` in ${workspaceName}` : ''} and added you to the team`,
            sender: creatorId,
            project: projectId,
            actionUrl: `/projects/${projectId}`,
            metadata: {
              projectId,
              creatorId,
              workspaceName,
              notificationType: 'project_created'
            }
          });
          notifications.push(notification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error creating project created notification:', error);
      throw error;
    }
  }

  static async createProjectUpdatedNotification(projectId, updatedByUserId, teamMemberIds, projectName, updateType = 'general') {
    try {
      const updatedBy = await User.findById(updatedByUserId).select('name');
      const notifications = [];

      for (const memberId of teamMemberIds) {
        if (memberId.toString() !== updatedByUserId.toString()) {
          const notification = await this.createNotification({
            recipient: memberId,
            type: 'project',
            title: 'Project Updated',
            message: `${updatedBy?.name || 'Someone'} updated project "${projectName}"`,
            sender: updatedByUserId,
            project: projectId,
            actionUrl: `/projects/${projectId}`,
            metadata: {
              projectId,
              updatedByUserId,
              updateType,
              notificationType: 'project_updated'
            }
          });
          notifications.push(notification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error creating project updated notification:', error);
      throw error;
    }
  }

  // Workspace-related notifications
  static async createWorkspaceInviteNotification(inviteId, invitedUserId, inviterUserId, workspaceName) {
    try {
      const inviter = await User.findById(inviterUserId).select('name');
      return await this.createNotification({
        recipient: invitedUserId,
        type: 'member_invite',
        title: 'Workspace Invitation',
        message: `${inviter?.name || 'Someone'} invited you to join "${workspaceName}" workspace`,
        sender: inviterUserId,
        inviteId: inviteId,
        actionUrl: `/invites/${inviteId}`,
        metadata: {
          inviteId,
          inviterUserId,
          workspaceName,
          notificationType: 'workspace_invite'
        }
      });
    } catch (error) {
      console.error('Error creating workspace invite notification:', error);
      throw error;
    }
  }

  static async createWorkspaceJoinedNotification(workspaceId, newMemberId, adminIds, newMemberName, workspaceName) {
    try {
      const notifications = [];

      for (const adminId of adminIds) {
        if (adminId.toString() !== newMemberId.toString()) {
          const notification = await this.createNotification({
            recipient: adminId,
            type: 'workspace',
            title: 'New Member Joined',
            message: `${newMemberName} joined the "${workspaceName}" workspace`,
            sender: newMemberId,
            workspace: workspaceId,
            actionUrl: `/workspaces/${workspaceId}/members`,
            metadata: {
              workspaceId,
              newMemberId,
              workspaceName,
              notificationType: 'member_joined'
            }
          });
          notifications.push(notification);
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error creating workspace joined notification:', error);
      throw error;
    }
  }

}

export default NotificationService;