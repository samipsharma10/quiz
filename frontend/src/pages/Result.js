import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) { navigate('/dashboard'); return null; }

  const { score, total, difficulty } = state;
  const percent = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percent >= 90) return { emoji: '🏆', text: 'Outstanding!', sub: 'You\'re a quiz master!' };
    if (percent >= 70) return { emoji: '🎉', text: 'Great Job!', sub: 'You really know your stuff!' };
    if (percent >= 50) return { emoji: '👍', text: 'Not Bad!', sub: 'Keep practicing to improve!' };
    return { emoji: '💪', text: 'Keep Going!', sub: 'Practice makes perfect!' };
  };

  const msg = getMessage();
  const strokeDash = (percent / 100) * 283;

  return (
    <div className="result-page">
      <div className="result-card">
        <div className="result-emoji">{msg.emoji}</div>
        <h1 className="result-title">{msg.text}</h1>
        <p className="result-sub">{msg.sub}</p>

        <div className="score-circle">
          <svg viewBox="0 0 100 100" className="score-svg">
            <circle className="score-bg" cx="50" cy="50" r="45" />
            <circle className="score-fill" cx="50" cy="50" r="45"
              strokeDasharray={`${strokeDash} 283`} />
          </svg>
          <div className="score-inner">
            <span className="score-num">{percent}%</span>
            <span className="score-label">{score}/{total}</span>
          </div>
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value">{total - score}</span>
            <span className="stat-label">Wrong</span>
          </div>
          <div className="stat">
            <span className="stat-value">{difficulty}</span>
            <span className="stat-label">Level</span>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/quiz/${difficulty}`)}>
            🔄 Play Again
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
