const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Question = require('../models/Question');
const Score = require('../models/Score');

// GET /api/quiz/:difficulty - fetch questions by difficulty
router.get('/:difficulty', authMiddleware, async (req, res) => {
  try {
    const { difficulty } = req.params;
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
    const questions = await Question.find({ difficulty }).limit(10);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/quiz/submit - submit quiz score
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { difficulty, score, totalQuestions, timeTaken } = req.body;
    const newScore = await Score.create({
      user: req.user.id,
      difficulty,
      score,
      totalQuestions,
      timeTaken
    });
    res.json({ message: 'Score saved', score: newScore });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
