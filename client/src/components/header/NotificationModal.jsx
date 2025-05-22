import React from 'react';
import '../../styles/NotificationModal.css';

const NotificationModal = ({ notification, onClose }) => {
    if (!notification) return null;

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose(e);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleCloseClick = (e) => {
        e.stopPropagation();
        onClose(e);
    };

    return (
        <div className="notification-modal-overlay" onClick={handleOverlayClick}>
            <div className="notification-modal" onClick={handleModalClick}>
                <div className="notification-modal-header">
                    <h3>Notification Details</h3>
                    <button className="notification-modal-close" onClick={handleCloseClick}>×</button>
                </div>
                <div className="notification-modal-content">
                    {notification.userId?.name && (
                        <div className="notification-modal-user">
                            <span className="label">From:</span>
                            <span className="value">{notification.userId.name}</span>
                        </div>
                    )}
                    <div className="notification-modal-message">
                        <span className="label">Message:</span>
                        <p className="value">{notification.message}</p>
                    </div>
                    <div className="notification-modal-time">
                        <span className="label">Time:</span>
                        <span className="value">
                            {new Date(notification.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <div className="notification-modal-status">
                        <span className="label">Status:</span>
                        <span className={`value ${notification.isRead ? 'read' : 'unread'}`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal; 