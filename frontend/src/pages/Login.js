import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  if (user) return <Navigate to="/dashboard" />;

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🧠</div>
        <h1>QuizMaster</h1>
        <p className="login-subtitle">Test your knowledge across multiple difficulty levels!</p>

        <div className="features">
          <div className="feature"><span>⚡</span> Timed Questions</div>
          <div className="feature"><span>🏆</span> Score Tracking</div>
          <div className="feature"><span>📈</span> 3 Difficulty Levels</div>
        </div>

        <button className="btn btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width="24"
          />
          Continue with Google
        </button>

        <p className="login-note">Free to use · No credit card required</p>

        <button className="admin-link" onClick={() => navigate('/admin/login')}>
          🛡️ Admin Login
        </button>
      </div>
    </div>
  );
};

export default Login;
