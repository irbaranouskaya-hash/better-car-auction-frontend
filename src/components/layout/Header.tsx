import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Car, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import './Header.css';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="header-logo">
          <Car size={28} />
          <span>Better Car Auction</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/auctions" className="header-nav-link">
            Auctions
          </Link>
          <Link to="/cars" className="header-nav-link">
            Cars
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/my-cars" className="header-nav-link">
                My Cars
              </Link>
              <Link to="/my-bids" className="header-nav-link">
                My Bids
              </Link>
              {isAdmin && (
                <Link to="/admin" className="header-nav-link header-nav-link-admin">
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="header-profile">
              <button
                className="header-profile-button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <User size={20} />
                <span>{user?.name}</span>
              </button>
              {profileMenuOpen && (
                <div className="header-profile-menu">
                  <Link
                    to="/profile"
                    className="header-profile-menu-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="header-profile-menu-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <Settings size={18} />
                    Change Password
                  </Link>
                  <button
                    className="header-profile-menu-item header-profile-menu-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header-auth-link">
                Login
              </Link>
              <Link to="/register" className="header-auth-button">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          <Link
            to="/auctions"
            className="header-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Auctions
          </Link>
          <Link
            to="/cars"
            className="header-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cars
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/my-cars"
                className="header-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Cars
              </Link>
              <Link
                to="/my-bids"
                className="header-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bids
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="header-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                className="header-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                className="header-mobile-link header-mobile-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="header-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="header-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

