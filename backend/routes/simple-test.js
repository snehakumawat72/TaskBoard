// Simple test route for direct notification creation
import express from "express";
import Notification from "../models/notification.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

// Simple test endpoint - creates notification directly in database
router.post("/simple-test", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Create a simple notification directly
    const notification = new Notification({
      userId: userId,
      type: 'login_welcome',
      title: 'Test Notification',
      message: `Hello ${req.user.name}! This is a test notification created at ${new Date().toLocaleTimeString()}`,
      isRead: false,
      senderName: 'System',
      senderAvatar: null,
      workspaceName: 'Test Workspace',
      projectName: null,
      taskName: null,
      inviteId: null,
      workspaceId: null
    });

    await notification.save();

    console.log('✅ Simple test notification created:', {
      id: notification._id,
      userId: userId,
      title: notification.title,
      message: notification.message
    });

    res.json({
      success: true,
      message: 'Test notification created successfully',
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type
      }
    });

  } catch (error) {
    console.error('❌ Error creating simple test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test notification',
      error: error.message
    });
  }
});

export default router;
