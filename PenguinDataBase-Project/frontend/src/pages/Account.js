import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/authService';
import '../styles/Auth.css';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [penguinCount, setPenguinCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setPenguinCount(currentUser.penguinCount || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>🔒 Not Logged In</h1>
          <p>Please log in to view your account.</p>
          <button onClick={() => navigate('/login')} className="auth-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card account-card">
        <h1>🐧 My Account</h1>
        
        <div className="account-info">
          <div className="info-section">
            <h3>Profile Information</h3>
            <div className="info-item">
              <strong>Username:</strong>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <strong>Member Since:</strong>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>🐧 My Penguins</h3>
            <div className="info-item">
              <strong>Total Penguins:</strong>
              <span>{loading ? 'Loading...' : penguinCount}</span>
            </div>
            <button 
              onClick={() => navigate('/database')} 
              className="auth-button"
              style={{ marginTop: '1rem' }}
            >
              View My Penguins
            </button>
          </div>

          <div className="account-actions">
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;