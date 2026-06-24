const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Score = require('../models/Score');

// GET /api/user/scores - get logged-in user's scores
router.get('/scores', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
