import { React, useState } from 'react';
import { FaUserCircle } from "react-icons/fa"; 
import { Link } from 'react-router-dom';
import '../../styles/header.css';


const Header = () => {


  return (
    <>
      <header className='header'>
        <div className='header-container'>
          <Link to='/home' className='logo'>
            <span className='logo-text'>TManage</span>
          </Link>

          <nav className='nav-menu'>
            <div className='auth-links'>
              <Link to='/dashboard' className='nav-link'>
                Dashboard
              </Link>
            </div>    
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
