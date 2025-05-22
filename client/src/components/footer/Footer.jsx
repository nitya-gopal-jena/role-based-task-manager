import React from 'react'
import '../../styles/footer.css'
import { Link } from 'react-router-dom'
import { FaLinkedin, FaGithub } from "react-icons/fa";
const Footer = () => {
  return (
    <>
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">T~Manage</h3>
                        <p className="footer-description">
                           Your all-in-one platform for managing and tracking tasks.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                              <li><Link to="/home">Home</Link></li>
                              <li><Link to="/dashboard">Dashboard</Link></li>
                               <li><Link to="/about">About</Link></li>
                              
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li><a href="mailto:support@myapp.com">support@xyz.com</a></li>
                            <li><a href="tel:+1234567890">+91 000-000-000</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <a href="https://github.com/nitya-gopal-jena/role-based-task-manager" className="social-link">
                                < FaGithub className="fab fa-github" /> 
                            </a>
                            <a href="https://www.linkedin.com/in/nitya-gopal-jena" className="social-link">
                               <FaLinkedin  className="fab fa-linkedin"/>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} T~Manage. All rights reserved.</p>
                </div>
            </div>
        </footer>
      
      </>
  )
}

export default Footer