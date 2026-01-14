import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="Nav-bar" aria-label="Main navigation">
      <Link 
        to="/" 
        className={`Nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`Nav-link ${location.pathname === '/about' ? 'active' : ''}`}
      >
        About
      </Link>
      <Link 
        to="/database" 
        className={`Nav-link ${location.pathname === '/database' ? 'active' : ''}`}
      >
        Database
      </Link>
      <Link 
        to="/map" 
        className={`Nav-link ${location.pathname === '/map' ? 'active' : ''}`}
      >
        Map
      </Link>
      
      {isAuthenticated ? (
        <Link 
          to="/account" 
          className={`Nav-link ${location.pathname === '/account' ? 'active' : ''}`}
        >
          Account
        </Link>
      ) : (
        <Link 
          to="/login" 
          className={`Nav-link ${location.pathname === '/login' ? 'active' : ''}`}
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navigation;

