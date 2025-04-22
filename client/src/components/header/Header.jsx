import { React, useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserEdit } from 'react-icons/fa';
import { IoLogOut } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/header.css';

const Header = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown
  const location = useLocation();
  const navigate = useNavigate();

  // Get and store username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close the dropdown
    }
  };

  // Add event listener when drop down mounts and remove when unmounts
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/edit-profile') {
      setDropdownOpen(false);
    }
  }, [location]);

  // User logout function logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
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
            <span className='logo-text'>T~MANAGE</span>
          </Link>

          <nav className='nav-menu'>
            <div className='auth-links'>
              <div className='nav-link'>
                {/* <Link to='/dashboard' className='dashboard'>
                  Dashboard
                </Link> */}
                {/* <Link to='/users' className='links-group'>
                Users
                </Link> */}
                {/* <Link to='/admin' className='links-group'>
                  Admin
                </Link> */}
                <Link to='/task' className='links-group'>
                  View Task
                </Link>
                <Link to='/about' className='links-group'>
                  About
                </Link>
              </div>

              {/* Create a user profile icon with drop down features  */}
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
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
