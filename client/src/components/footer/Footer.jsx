import React from 'react'
import '../../styles/footer.css'
import { Link } from 'react-router-dom'
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
                            <a href="#" className="social-link">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="#" className="social-link">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="social-link">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="social-link">
                                <i className="fab fa-linkedin"></i>
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