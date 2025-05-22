import React from 'react';
import { format } from 'date-fns';
import { IoMdNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from 'axios';

const NotificationDropdown = ({ notifications, unreadCount, onMarkAsRead }) => {
    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            onMarkAsRead(notificationId);
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>Notifications</h3>
                <span className="notification-count">{unreadCount} new</span>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        >
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">
                                    {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                </span>
                            </div>
                            {!notification.isRead && (
                                <button
                                    className="mark-read-btn"
                                    onClick={() => handleMarkAsRead(notification._id)}
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
