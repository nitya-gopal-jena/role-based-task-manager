import React from 'react';
import '../styles/home.css';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <>
      <div className='home-container'>
        {/* Hero Section */}
        <section className='hero-section'>
          <div className='hero-content'>
            <h1 className='hero-title'>
              Welcome to <span className='gradient-text'>TaskManage</span>
            </h1>
            <p className='hero-subtitle'>Your all-in-one platform for managing and tracking tasks </p>
            <div className='hero-buttons'>
              <Link to='/register' className='hero-button primary'>
                Get Started
              </Link>
              <Link to='/login' className='hero-button secondary'>
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='features-section'>
          <h2 className='section-title'>The Platform's Features</h2>
          <div className='features-grid'>
            <div className='feature-card'>
              <div className='feature-icon'>👥</div>
              <h3>Role-Based Access</h3>
              <p>Control user permissions with precise role-based access</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🔒</div>
              <h3>Auto Logout</h3>
              <p>Ensuring security with automatic session timeout</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>✅</div>
              <h3>Task Management</h3>
              <p>Assign, track, and manage tasks efficiently</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>📱</div>
              <h3>Responsive Design</h3>
              <p>Access your tasks from any device, anywhere</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🚀</div>
              <h3>Fast & Efficient</h3>
              <p>Lightning-fast performance and real-time updates</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>💡</div>
              <h3>Intuitive</h3>
              <p>User-friendly interface for seamless experience</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
