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
            <p className='hero-subtitle'>Your all-in-one platform for managing and tracking tasks</p>

            <div className='hero-buttons'>
              <Link to='/all-tasks-list' className='hero-button primary'>
                List Tasks
              </Link>
              <Link to='/dashboard' className='hero-button secondary'>
                Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='features-section'>
          <h2 className='section-title'>Why Choose Us?</h2>
          <div className='features-grid'>
            <div className='feature-card'>
              <div className='feature-icon'>🚀</div>
              <h3>Fast & Efficient</h3>
              <p>Lightning-fast performance and real-time updates</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🧑‍💼</div>
              <h3>Role-Based Access</h3>
              <p>Custom permissions for Admins, and Users</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>💡</div>
              <h3>Intuitive</h3>
              <p>User-friendly interface for seamless experience</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>⏳</div>
              <h3>Auto Logout</h3>
              <p>Enhanced security with inactivity timeout</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🔒</div>
              <h3>Secure Password</h3>
              <p>Secure authentication & token handling</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>🔄</div>
              <h3>Always Updated</h3>
              <p>Regular updates and new features</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
