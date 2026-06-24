import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Quiz ────────────────────────────────────────────────────────
export const fetchQuestions = (difficulty) => API.get(`/api/quiz/${difficulty}`);
export const submitScore = (data) => API.post('/api/quiz/submit', data);
export const getUserScores = () => API.get('/api/user/scores');

// ── Admin Auth ──────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  API.post('/auth/admin/login', { email, password });

// ── Admin Questions ─────────────────────────────────────────────
export const adminGetQuestions = (params) => API.get('/api/admin/questions', { params });
export const adminCreateQuestion = (data) => API.post('/api/admin/questions', data);
export const adminUpdateQuestion = (id, data) => API.put(`/api/admin/questions/${id}`, data);
export const adminDeleteQuestion = (id) => API.delete(`/api/admin/questions/${id}`);

// ── Admin Stats ─────────────────────────────────────────────────
export const adminGetStats = () => API.get('/api/admin/stats');
export const adminGetUsers = () => API.get('/api/admin/users');

export default API;
