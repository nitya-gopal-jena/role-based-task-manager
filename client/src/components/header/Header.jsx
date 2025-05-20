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
import '../../styles/header.css';
import { getCurrentUserRole, getCurrentUserName, ROLE_ADMIN, ROLE_USER } from '../../utils/Utils';

const Header = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(getCurrentUserName());

    if (location.pathname === '/edit-profile') {
      setDropdownOpen(false);
    }
  }, [location]);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close the dropdown
    }
  };

  useEffect(() => {
    if (location.pathname === '/edit-profile') {
      setDropdownOpen(false);
    }
  }, [location]);

  // User logout function logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully');
    navigate('/');
  };

  // User edit-profile function logic
  const editProfile = () => {
    navigate('/edit-profile');
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
              <div className={`nav-link ${isMobileMenuOpen ? 'show-menu' : ''}`}>
                <Link to='/all-tasks-list' className='links-group'>
                  List Task
                </Link>
                {getCurrentUserRole() === ROLE_ADMIN && (
                  <Link to='/all-users-list' className='links-group'>
                    List Users
                  </Link>
                )}
                <Link to='/about' className='links-group'>
                  About
                </Link>
                <Link to='/dashboard' className='dashboard'>
                  <BiSolidDashboard className='dash-icon' />
                  Dashboard
                </Link>
              </div>

              <div className='notification'>
                <IoMdNotifications className='notification-icon' />
              </div>

              <div className='user-dropdown' ref={dropdownRef} onClick={handleClickOutside}>
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
              <GiHamburgerMenu className='hamburger-icon' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
