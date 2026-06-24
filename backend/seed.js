const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const questions = [
  // EASY
  { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 2, difficulty: 'easy' },
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: 1, difficulty: 'easy' },
  { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mars', 'Mercury'], correctAnswer: 3, difficulty: 'easy' },
  { question: 'What color is the sky on a clear day?', options: ['Green', 'Blue', 'Red', 'Yellow'], correctAnswer: 1, difficulty: 'easy' },
  { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctAnswer: 2, difficulty: 'easy' },
  { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3, difficulty: 'easy' },
  { question: 'Which animal is known as man\'s best friend?', options: ['Cat', 'Dog', 'Horse', 'Rabbit'], correctAnswer: 1, difficulty: 'easy' },
  { question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], correctAnswer: 1, difficulty: 'easy' },
  { question: 'What is the boiling point of water in Celsius?', options: ['90', '95', '100', '105'], correctAnswer: 2, difficulty: 'easy' },
  { question: 'Who wrote Romeo and Juliet?', options: ['Dickens', 'Shakespeare', 'Twain', 'Hemingway'], correctAnswer: 1, difficulty: 'easy' },

  // MEDIUM
  { question: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'What is the speed of light in km/s (approx)?', options: ['100,000', '200,000', '300,000', '400,000'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'Which country has the largest population?', options: ['USA', 'India', 'China', 'Russia'], correctAnswer: 1, difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Protocol', 'None'], correctAnswer: 0, difficulty: 'medium' },
  { question: 'Which gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correctAnswer: 2, difficulty: 'medium' },
  { question: 'Who invented the telephone?', options: ['Edison', 'Bell', 'Tesla', 'Marconi'], correctAnswer: 1, difficulty: 'medium' },
  { question: 'What programming language is known as the "mother" of all languages?', options: ['C', 'Assembly', 'Fortran', 'COBOL'], correctAnswer: 0, difficulty: 'medium' },

  // HARD
  { question: 'What is the Heisenberg Uncertainty Principle?', options: ['Speed of light is constant', 'Cannot simultaneously know exact position and momentum', 'Mass and energy are equivalent', 'Entropy always increases'], correctAnswer: 1, difficulty: 'hard' },
  { question: 'What is the time complexity of Quicksort in the worst case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 2, difficulty: 'hard' },
  { question: 'Which element has atomic number 79?', options: ['Silver', 'Platinum', 'Gold', 'Copper'], correctAnswer: 2, difficulty: 'hard' },
  { question: 'What is Schrödinger\'s cat a thought experiment about?', options: ['Relativity', 'Quantum superposition', 'Wave-particle duality', 'String theory'], correctAnswer: 1, difficulty: 'hard' },
  { question: 'What is the Fibonacci sequence formula?', options: ['F(n) = n+1', 'F(n) = F(n-1) * F(n-2)', 'F(n) = F(n-1) + F(n-2)', 'F(n) = 2^n'], correctAnswer: 2, difficulty: 'hard' },
  { question: 'Who developed the theory of general relativity?', options: ['Newton', 'Bohr', 'Einstein', 'Hawking'], correctAnswer: 2, difficulty: 'hard' },
  { question: 'What is the half-life of Carbon-14?', options: ['1,000 years', '5,730 years', '10,000 years', '50,000 years'], correctAnswer: 1, difficulty: 'hard' },
  { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Logic', 'Standard Query Language'], correctAnswer: 0, difficulty: 'hard' },
  { question: 'In Big O notation, what is O(1) called?', options: ['Linear', 'Logarithmic', 'Quadratic', 'Constant'], correctAnswer: 3, difficulty: 'hard' },
  { question: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctAnswer: 2, difficulty: 'hard' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('✅ Database seeded with 30 questions!');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
