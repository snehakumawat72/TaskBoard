// backend/routes/notificationRoutes.js

import express from 'express';
import authenticateUser from '../middleware/auth-middleware.js';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateUser, getUserNotifications);
router.put('/mark-all-as-read', authenticateUser, markAllNotificationsAsRead);

export default router;