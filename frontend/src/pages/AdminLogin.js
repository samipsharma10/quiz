import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../utils/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const { user, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) return <Navigate to="/admin/dashboard" />;
  if (user && !isAdmin) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      login(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">🛡️</div>
        <h1>Admin Portal</h1>
        <p className="admin-login-sub">QuizMaster Administration</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@quizmaster.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-admin" disabled={loading}>
            {loading ? 'Signing in...' : '🔐 Sign In as Admin'}
          </button>
        </form>

        <button
          className="back-link"
          onClick={() => navigate('/login')}
        >
          ← Back to user login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
