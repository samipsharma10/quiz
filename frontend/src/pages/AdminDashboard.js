import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminGetQuestions, adminCreateQuestion, adminUpdateQuestion,
  adminDeleteQuestion, adminGetStats, adminGetUsers
} from '../utils/api';
import './AdminDashboard.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const EMPTY_FORM = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  difficulty: 'easy',
  category: 'General'
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = window.localStorage.getItem('adminTheme');
  return savedTheme === 'light' ? 'light' : 'dark';
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(getInitialTheme);

  const [tab, setTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filterDiff, setFilterDiff] = useState('');

  const [modal, setModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('adminTheme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = filterDiff ? { difficulty: filterDiff } : {};
      const res = await adminGetQuestions(params);
      setQuestions(res.data);
    } catch {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [filterDiff]);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminGetStats();
      setStats(res.data);
    } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetUsers();
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'questions') loadQuestions();
    if (tab === 'stats') loadStats();
    if (tab === 'users') loadUsers();
  }, [tab, loadQuestions, loadStats, loadUsers]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setModal('create');
    setEditId(null);
  };

  const openEdit = (q) => {
    setForm({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      category: q.category || 'General'
    });
    setFormError('');
    setEditId(q._id);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleOptionChange = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const validateForm = () => {
    if (!form.question.trim()) return 'Question is required';
    if (form.options.some(o => !o.trim())) return 'All 4 options are required';
    if (form.correctAnswer < 0 || form.correctAnswer >= form.options.length)
      return 'Select a valid correct answer';
    if (!form.difficulty) return 'Difficulty is required';
    return null;
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) return setFormError(err);

    setSaving(true);
    setFormError('');

    try {
      if (modal === 'create') {
        await adminCreateQuestion(form);
        showSuccess('Question created successfully!');
      } else {
        await adminUpdateQuestion(editId, form);
        showSuccess('Question updated successfully!');
      }
      closeModal();
      loadQuestions();
    } catch (e) {
      setFormError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteQuestion(id);
      setDeleteId(null);
      showSuccess('Question deleted');
      loadQuestions();
    } catch {
      setError('Delete failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-dash ${theme === 'light' ? 'light-mode' : ''}`}>
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">🛡️ QuizMaster Admin</div>
        <div className="admin-user">
          <button className="btn-theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <span className="admin-badge">ADMIN</span>
          <span>{user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        {['questions', 'stats', 'users'].map(t => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'questions' ? '📝 Questions' : t === 'stats' ? '📊 Stats' : '👥 Users'}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* QUESTIONS */}
        {tab === 'questions' && (
          <>
            <div className="section-header">
              <div className="filter-row">
                <select
                  value={filterDiff}
                  onChange={e => setFilterDiff(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Difficulties</option>
                  {DIFFICULTIES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="q-count">{questions.length} questions</span>
              </div>
              <button className="btn-create" onClick={openCreate}>
                + Add Question
              </button>
            </div>

            {loading ? (
              <div className="admin-loading">Loading...</div>
            ) : (
              <div className="questions-table-wrap">
                <table className="questions-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => (
                      <tr key={q._id}>
                        <td>{i + 1}</td>
                        <td>{q.question}</td>
                        <td>{q.category}</td>
                        <td>{q.difficulty}</td>
                        <td>
                          <button onClick={() => openEdit(q)}>Edit</button>
                          <button onClick={() => setDeleteId(q._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- FULL MODAL FORM ---------- */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? '➕ Add Question' : '✏️ Edit Question'}</h2>

            {formError && <div className="form-error">{formError}</div>}

            <label>Question</label>
            <textarea
              value={form.question}
              onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              placeholder="Enter question text..."
            />

            <label>Options</label>
            <div className="options-grid">
              {form.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={e => handleOptionChange(i, e.target.value)}
                />
              ))}
            </div>

            <label>Correct Answer</label>
            <select
              value={form.correctAnswer}
              onChange={e => setForm(f => ({ ...f, correctAnswer: parseInt(e.target.value) }))}
            >
              {form.options.map((opt, i) => (
                <option key={i} value={i}>{opt || `Option ${i + 1}`}</option>
              ))}
            </select>

            <label>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <label>Category</label>
            <input
              type="text"
              placeholder="e.g., General, Science"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-card">
            <p>Are you sure you want to delete this question?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-save" style={{ background: 'var(--danger)' }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;