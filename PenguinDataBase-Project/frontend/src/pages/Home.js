import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DailyPenguin from '../components/penguin/DailyPenguin';
import PenguinForm from '../components/penguin/PenguinForm';
import '../styles/Auth.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      
      {isAuthenticated ? (
        <>
          <DailyPenguin />
          <h3>Welcome back, {user?.username}! 🐧</h3>
          <p>Add a new penguin to your collection:</p>
          <PenguinForm />
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          margin: '2rem 0'
        }}>
          <h3 className="login-prompt-title">🔒 Add Your Own Penguins!</h3>
          <p className="login-prompt-text">Log in to start building your personal penguin collection.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="auth-button"
          >
            Login to Add Penguins
          </button>
          <p className="auth-link">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;