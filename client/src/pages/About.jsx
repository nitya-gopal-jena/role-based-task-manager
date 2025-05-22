import React from "react";
import '../styles/about.css'

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>
          <span className="header-logo">📋</span>{" "}
          <span className="header-title">About Us</span>
        </h1>
        <p className="subtitle">Your Trusted Task Management Solution</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>
            <span className="section-icon">🎯</span>{" "}
            <span className="section-title">Our Mission</span>
          </h2>
          <p>
            We are dedicated to providing a seamless and efficient task
            management platform that helps individuals and teams organize their
            work, boost productivity, and achieve their goals.
          </p>
        </section>

        <section className="about-section">
          <h2>
            <span className="section-icon">⚙</span> What We Offer
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3>Task Management</h3>
              <p>Organize and track your tasks with ease</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🧑‍💼</span>
              <h3>Role-Based Access</h3>
              <p>Custom permissions for Admins, and Users</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤝</span>
              <span className="planned-label">🔜 Planned</span>
              <h3>Team Collaboration</h3>
              <p>Work together seamlessly with your team</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <span className="planned-label">🔜 Planned</span>
              <h3>Progress Tracking</h3>
              <p>Monitor your progress and stay on track</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>
            <span className="section-icon">⭐</span> Why Choose Us
          </h2>
          <ul className="benefits-list">
            <li>
              <span className="benefits-icon">👆</span> User-friendly interface
              for easy navigation
            </li>
            <li>
              <span className="benefits-icon">🔒</span> Secure and reliable
              platform
            </li>
            <li>
              <span className="benefits-icon">🔄</span> Regular updates and
              improvements
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;