import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

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
    </nav>
  );
};

export default Navigation;

