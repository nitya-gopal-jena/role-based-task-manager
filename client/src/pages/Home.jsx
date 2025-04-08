import React from 'react';
import '../styles/home.css';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <>
      <div className='home-container'>
        {/* Hero Section */}
        <div className='hero-content'>
          <h1 className='hero-title'>
            {' '}
            Welcome to <span className='gradient-text'>TaskManager</span>
          </h1>
          <p className='hero-subtitle'>Your all-in-one platform for managing and tracking tasks</p>

          <div className='hero-buttons'>
            <Link to='/register' className='hero-button primary'>
              Get Started
            </Link>
            <Link to='/login' className='hero-button secondary'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
