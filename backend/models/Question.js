const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option (0-3)
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: String, default: 'General' }
});

module.exports = mongoose.model('Question', questionSchema);
