import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatabaseStats from '../components/penguin/DatabaseStats';
import PenguinList from '../components/penguin/PenguinList';
import PenguinSheet from '../components/penguin/PenguinSheet';
import PenguinSearch from '../components/penguin/PenguinSearch';
import '../styles/Auth.css';

const Database = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>🔒 Login Required</h1>
          <p className="auth-subtitle">Please log in to view your penguin database.</p>
          <button onClick={() => navigate('/login')} className="auth-button">
            Go to Login
          </button>
          <p className="auth-link">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="database-page">
      <h2>🐧 My Penguin Database</h2>
      <p>Viewing penguins for: <strong>{user?.username}</strong></p>
      <PenguinSearch />
      <PenguinList />
    </div>
  );
};

export default Database;

//      <DatabaseStats />
//       <PenguinSheet />

