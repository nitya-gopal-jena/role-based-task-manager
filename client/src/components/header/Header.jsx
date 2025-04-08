import { React, useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link , useLocation} from 'react-router-dom';
import '../../styles/header.css';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown
  const location = useLocation()

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



  return (
    <>
      <header className='header'>
        <div className='header-container'>
          <Link to='/home' className='logo'>
            <span className='logo-text'>T~MANAGE</span>
          </Link>

          <nav className='nav-menu'>
            <div className='auth-links'>
              <div className="nav-link">
              <Link to='/dashboard' className='dashboard'>
                Dashboard
              </Link>
          </div>

              {/* Create a user profile icon with drop down features  */}
              <div className='user-dropdown' ref={dropdownRef}>
                <div className='user-info' onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FaUserCircle size={30} />
                  <span>Username</span>
                </div>

                {dropdownOpen && (
                  <div className='dropdown-menu'>
                    <Link to='/edit-profile' className='edit-profile'>
                      Edit Profile
                    </Link>
                    <button className='logout'>Logout</button>
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
