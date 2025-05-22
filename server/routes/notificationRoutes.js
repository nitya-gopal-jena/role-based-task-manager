import express from "express";
import {
    getAllNotifications,
    getUserNotifications,
    markNotificationAsRead,
} from "../controllers/notificationController.js";
import authenticateUser from "../middlewares/userAuthenticator.js";

const router = express.Router();

// Protected routes
router.use(authenticateUser);

// Get all notifications (admin only)
router.get("/all", getAllNotifications);

// Get user's notifications
router.get("/user", getUserNotifications);

// Mark notification as read
router.put("/:id/read", markNotificationAsRead);

export default router;
