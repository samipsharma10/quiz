import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions, submitScore } from '../utils/api';
import './Quiz.css';

const TIME_LIMITS = { easy: 15, medium: 12, hard: 10 };

const Quiz = () => {
  const { difficulty } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMITS[difficulty] || 15);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  // Keep a ref of score so nextQuestion always reads the latest value
  const scoreRef = useRef(0);

  useEffect(() => {
    fetchQuestions(difficulty)
      .then(res => { setQuestions(res.data); setLoading(false); })
      .catch(() => navigate('/dashboard'));
  }, [difficulty, navigate]);

  const nextQuestion = useCallback((currentIndex, latestScore, totalQuestions) => {
    if (currentIndex + 1 >= totalQuestions) {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      submitScore({ difficulty, score: latestScore, totalQuestions, timeTaken }).catch(() => {});
      navigate('/result', { state: { score: latestScore, total: totalQuestions, difficulty } });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(TIME_LIMITS[difficulty] || 15);
    }
  }, [difficulty, navigate, startTime]);

  // Timer — when it hits 0, advance with current score
  useEffect(() => {
    if (loading || answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      setTimeout(() => nextQuestion(current, scoreRef.current, questions.length), 1000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, answered, nextQuestion, current, questions.length]);

  const handleAnswer = (idx) => {
    if (answered) return;

    setSelected(idx);
    setAnswered(true);

    // Calculate new score synchronously using ref — no stale closure
    let newScore = scoreRef.current;
    if (idx === questions[current].correctAnswer) {
      newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
    }

    // Pass values directly — no reliance on state being updated yet
    setTimeout(() => nextQuestion(current, newScore, questions.length), 1200);
  };

  if (loading) return <div className="loading">Loading questions...</div>;
  if (!questions.length) return <div className="loading">No questions found!</div>;

  const q = questions[current];
  const timePercent = (timeLeft / (TIME_LIMITS[difficulty] || 15)) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-info">
            <span className="quiz-diff">{difficulty.toUpperCase()}</span>
            <span>Question {current + 1} of {questions.length}</span>
          </div>
          <div className="quiz-score">Score: {score}</div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>

        {/* Timer */}
        <div className="timer-section">
          <div className={`timer-circle ${timeLeft <= 5 ? 'danger' : timeLeft <= 8 ? 'warning' : ''}`}>
            <svg viewBox="0 0 36 36" className="timer-svg">
              <path className="timer-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="timer-progress" strokeDasharray={`${timePercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="timer-text">{timeLeft}</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-card">
          <h2 className="question-text">{q.question}</h2>
        </div>

        {/* Options */}
        <div className="options-grid">
          {q.options.map((opt, idx) => {
            let cls = 'option-btn';
            if (answered) {
              if (idx === q.correctAnswer) cls += ' correct';
              else if (idx === selected) cls += ' wrong';
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={answered}>
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Bottom Nav */}
        <div className="quiz-bottom">
          <button className="btn-quit" onClick={() => navigate('/dashboard')}>Quit Quiz</button>
          {answered && (
            <button className="btn-next" onClick={() => nextQuestion(current, scoreRef.current, questions.length)}>
              {current + 1 >= questions.length ? 'See Results 🏆' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;