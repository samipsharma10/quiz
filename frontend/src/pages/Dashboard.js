import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserScores } from '../utils/api';
import './Dashboard.css';

const categories = [
  {
    level: 'easy',
    emoji: '🟢',
    title: 'Easy',
    desc: 'Perfect for beginners',
    color: '#27ae60',
    bg: 'rgba(39,174,96,0.15)',
    border: 'rgba(39,174,96,0.4)',
    time: '15 sec/question'
  },
  {
    level: 'medium',
    emoji: '🟡',
    title: 'Medium',
    desc: 'Test your knowledge',
    color: '#f39c12',
    bg: 'rgba(243,156,18,0.15)',
    border: 'rgba(243,156,18,0.4)',
    time: '12 sec/question'
  },
  {
    level: 'hard',
    emoji: '🔴',
    title: 'Hard',
    desc: 'For the brave minds',
    color: '#e94560',
    bg: 'rgba(233,69,96,0.15)',
    border: 'rgba(233,69,96,0.4)',
    time: '10 sec/question'
  }
];

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [scores, setScores] = useState([]);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // Load scores
  useEffect(() => {
    getUserScores()
      .then(res => setScores(res.data))
      .catch(() => {});
  }, []);

  // ✅ FIXED THEME SYSTEM (IMPORTANT)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const bestScore = (difficulty) => {
    const filtered = scores.filter(s => s.difficulty === difficulty);
    if (!filtered.length) return null;

    return Math.max(
      ...filtered.map(s =>
        Math.round((s.score / s.totalQuestions) * 100)
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-logo">🧠 QuizMaster</div>

        <div className="dash-user">

          {user?.avatar && (
            <img
              src={user.avatar}
              alt="avatar"
              className="user-avatar"
            />
          )}

          <span>{user?.name}</span>

          {/* THEME TOGGLE */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* ADMIN */}
          <button
            className="btn-admin-panel"
            onClick={() => navigate('/admin/dashboard')}
            style={{ display: isAdmin ? 'inline-block' : 'none' }}
          >
            🛡️ Admin
          </button>

          {/* LOGOUT */}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        <section className="dash-welcome">
          <h2>
            Welcome back,{' '}
            <span className="text-accent">
              {user?.name?.split(' ')[0]}
            </span>
            !
          </h2>
          <p>Choose your difficulty level and start the quiz</p>
        </section>

        {/* CATEGORY GRID */}
        <section className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.level}
              className="category-card"
              style={{
                background: cat.bg,
                borderColor: cat.border
              }}
              onClick={() => navigate(`/quiz/${cat.level}`)}
            >
              <div className="cat-emoji">{cat.emoji}</div>

              <h3 style={{ color: cat.color }}>
                {cat.title}
              </h3>

              <p className="cat-desc">{cat.desc}</p>

              <div className="cat-meta">
                <span>⏱ {cat.time}</span>
                <span>📝 10 questions</span>
              </div>

              {bestScore(cat.level) !== null && (
                <div
                  className="cat-best"
                  style={{ color: cat.color }}
                >
                  🏆 Best: {bestScore(cat.level)}%
                </div>
              )}

              <button
                className="cat-btn"
                style={{ background: cat.color }}
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </section>

        {/* SCORES */}
        {scores.length > 0 && (
          <section className="recent-scores">
            <h3>📊 Recent Scores</h3>

            <div className="scores-list">
              {scores.slice(0, 5).map((s, i) => (
                <div key={i} className="score-row">
                  <span className="score-diff">
                    {s.difficulty.toUpperCase()}
                  </span>

                  <span>
                    {s.score}/{s.totalQuestions}
                  </span>

                  <span className="score-pct">
                    {Math.round((s.score / s.totalQuestions) * 100)}%
                  </span>

                  <span className="score-date">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard; 