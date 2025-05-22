import { React, useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import { FaTasks } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdNotifications } from 'react-icons/io';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../../styles/header.css';
import NotificationModal from './NotificationModal';
import { getCurrentUserRole, getCurrentUserName, getCurrentUserId, ROLE_ADMIN, ROLE_USER } from '../../utils/Utils';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Header = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    const savedUnread = localStorage.getItem('unreadCount');
    return savedUnread ? parseInt(savedUnread) : 0;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('unreadCount', unreadCount.toString());
  }, [notifications, unreadCount]);

  useEffect(() => {
    setUsername(getCurrentUserName());
    fetchNotifications();

    // Initialize Socket.IO connection
    const socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Join user's room
    const userId = getCurrentUserId();
    if (userId) {
      socket.emit('join', userId);
    }

    // Join admin room if user is admin
    if (getCurrentUserRole() === ROLE_ADMIN) {
      socket.emit('joinAdmin');
    }

    // Listen for new notifications
    socket.on('notification', (newNotification) => {
      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated;
      });
      setUnreadCount((prev) => prev + 1);
      toast.info(newNotification.message);
    });

    // Handle socket connection events
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const isAdmin = getCurrentUserRole() === ROLE_ADMIN;
      const endpoint = isAdmin ? '/api/notifications/all' : '/api/notifications/user';

      const response = await api.get(endpoint);
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (notifications.length === 0) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.map((notification) => (notification._id === notificationId ? { ...notification, isRead: true } : notification)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Don't show toast for this error as it's not critical
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    // Only mark as read if it's not already read
    if (!notification.isRead) {
      try {
        await handleMarkAsRead(notification._id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleMarkAsReadClick = async (e, notificationId) => {
    e.stopPropagation(); // Prevent notification click
    try {
      await handleMarkAsRead(notificationId);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
      setNavDropdownOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      // Only close the dropdown if we're not clicking inside the modal
      if (!event.target.closest('.notification-modal')) {
        setShowNotifications(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // User logout function logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  // User edit-profile function logic
  const editProfile = () => {
    navigate('/edit-profile');
    window.location.reload();
  };

  const handleCloseModal = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event from bubbling up
    }
    setSelectedNotification(null);
  };

  return (
    <>
      <header className='header'>
        <div className='header-container'>
          <Link to='/home' className='logo'>
            <span className='logo-text'>
              <FaTasks className='logo-icon' />
              T~MANAGE
            </span>
          </Link>

          <nav className='nav-menu'>
            <div className='auth-links'>
              {/* Desktop Navigation */}
              <div className='desktop-nav'>
                <Link to='/all-tasks-list' className='nav-item'>
                  List Task
                </Link>
                {getCurrentUserRole() === ROLE_ADMIN && (
                  <Link to='/all-users-list' className='nav-item'>
                    List Users
                  </Link>
                )}
                <Link to='/about' className='nav-item'>
                  About
                </Link>
                <Link to='/dashboard' className='nav-item dashboard'>
                  <BiSolidDashboard className='dash-icon' />
                  Dashboard
                </Link>
              </div>

              <div className='notification-container' ref={notificationRef}>
                <div className='notification-icon-wrapper' onClick={() => setShowNotifications(!showNotifications)}>
                  <IoMdNotifications className='notification-icon' style={{color:"white"}} />
                  {unreadCount > 0 && <span className='notification-badge'>{unreadCount}</span>}
                </div>

                {showNotifications && (
                  <div className='notification-dropdown'>
                    <div className='notification-header'>
                      <h3>Notifications</h3>
                      <span className='notification-count'>{unreadCount} new</span>
                    </div>
                    <div className='notification-list'>
                      {isLoading ? (
                        <div className='loading-notifications'>Loading notifications...</div>
                      ) : notifications.length === 0 ? (
                        <div className='no-notifications'>No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification._id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`} onClick={() => handleNotificationClick(notification)}>
                            <div className='notification-content'>
                              <p className='notification-message'>
                                {getCurrentUserRole() === ROLE_ADMIN && notification.userId?.name && <span className='notification-user'>From: {notification.userId.name}</span>}
                                {notification.message}
                              </p>
                              <span className='notification-time'>{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>
                            {!notification.isRead && (
                              <button className='mark-read-btn' onClick={(e) => handleMarkAsReadClick(e, notification._id)}>
                                Mark as read
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className='user-dropdown' ref={dropdownRef}>
                <div className='user-info' onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FaUserCircle size={30} />
                  <span>{username}</span>
                </div>

                {dropdownOpen && (
                  <div className='dropdown-menu'>
                    <button className='edit-profile' onClick={editProfile}>
                      <FaUserEdit className='edit-profile-icon' /> Edit Profile
                    </button>
                    <button className='logout' onClick={handleLogout}>
                      <IoLogOut className='logout-icon' /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Dropdown */}
              <div className='mobile-nav' ref={navDropdownRef}>
                <button className='nav-dropdown-button' onClick={() => setNavDropdownOpen(!navDropdownOpen)}>
                  <GiHamburgerMenu className='hamburger-icon' />
                </button>
                {navDropdownOpen && (
                  <div className='nav-dropdown-menu'>
                    <Link to='/all-tasks-list' className='nav-dropdown-item'>
                      List Task
                    </Link>
                    {getCurrentUserRole() === ROLE_ADMIN && (
                      <Link to='/all-users-list' className='nav-dropdown-item'>
                        List Users
                      </Link>
                    )}
                    <Link to='/about' className='nav-dropdown-item'>
                      About
                    </Link>
                    <Link to='/dashboard' className='nav-dropdown-item'>
                      <BiSolidDashboard className='dash-icon' />
                      Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
      {selectedNotification && <NotificationModal notification={selectedNotification} onClose={handleCloseModal} />}
    </>
  );
};

export default Header;
