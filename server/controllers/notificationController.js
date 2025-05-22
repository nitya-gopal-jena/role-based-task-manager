import Notification from '../models/Notification.js';
import { getCurrentUserRole, getCurrentUserId, ROLE_ADMIN } from '../utils/utils.js';

// Get all notifications for admin
export const getAllNotifications = async (req, res) => {
    try {
        const currentUserRole = getCurrentUserRole(req);

        if (currentUserRole !== ROLE_ADMIN) {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name')
            .populate('taskId', 'title');

        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// Get notifications for current user
export const getUserNotifications = async (req, res) => {
    try {
        const currentUserId = getCurrentUserId(req);

        const notifications = await Notification.find({ userId: currentUserId })
            .sort({ createdAt: -1 })
            .populate('taskId', 'title');

        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const currentUserId = getCurrentUserId(req);
        const currentUserRole = getCurrentUserRole(req);

        // For admin users, allow marking any notification as read
        const query = currentUserRole === ROLE_ADMIN
            ? { _id: notificationId }
            : { _id: notificationId, userId: currentUserId };

        const notification = await Notification.findOne(query);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        return res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
}; 