const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middleware/auth');
const Question = require('../models/Question');
const Score = require('../models/Score');
const User = require('../models/User');

// ─── Questions CRUD ──────────────────────────────────────────────

// GET all questions (with optional filter)
router.get('/questions', adminMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.category) filter.category = req.query.category;
    const questions = await Question.find(filter).sort({ difficulty: 1, category: 1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create question
router.post('/questions', adminMiddleware, async (req, res) => {
  try {
    const { question, options, correctAnswer, difficulty, category } = req.body;
    if (!question || !options || options.length < 2 || correctAnswer === undefined || !difficulty)
      return res.status(400).json({ message: 'Missing required fields' });
    if (correctAnswer < 0 || correctAnswer >= options.length)
      return res.status(400).json({ message: 'correctAnswer index out of range' });

    const newQ = await Question.create({ question, options, correctAnswer, difficulty, category: category || 'General' });
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update question
router.put('/questions/:id', adminMiddleware, async (req, res) => {
  try {
    const { question, options, correctAnswer, difficulty, category } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer, difficulty, category },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE question
router.delete('/questions/:id', adminMiddleware, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Stats ───────────────────────────────────────────────────────
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const [totalQuestions, totalUsers, totalScores, byDifficulty] = await Promise.all([
      Question.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Score.countDocuments(),
      Question.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }])
    ]);
    res.json({ totalQuestions, totalUsers, totalScores, byDifficulty });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── All Users ───────────────────────────────────────────────────
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
