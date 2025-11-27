import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Better Car Auction</h4>
            <p className="footer-description">
              Your trusted platform for automated car pricing and auctions
            </p>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-heading">Quick Links</h5>
            <nav className="footer-links">
              <Link to="/auctions" className="footer-link">
                Auctions
              </Link>
              <Link to="/cars" className="footer-link">
                Cars
              </Link>
              <Link to="/my-cars" className="footer-link">
                My Cars
              </Link>
              <Link to="/my-bids" className="footer-link">
                My Bids
              </Link>
            </nav>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-heading">Account</h5>
            <nav className="footer-links">
              <Link to="/profile" className="footer-link">
                Profile
              </Link>
              <Link to="/login" className="footer-link">
                Login
              </Link>
              <Link to="/register" className="footer-link">
                Register
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Better Car Auction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

