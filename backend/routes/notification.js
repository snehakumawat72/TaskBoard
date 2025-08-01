import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from "../controllers/notification.js";
import authMiddleware from "../middleware/auth-middleware.js"; // adjust if needed

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
