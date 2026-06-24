# 🧠 QuizMaster — MERN Stack Quiz App

A full-stack online quiz application with Google OAuth login, timed questions, and score tracking.

---

## 📁 Project Structure

```
mern-quiz-app/
├── backend/          # Node.js + Express API
│   ├── config/       # Passport Google OAuth config
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas (User, Question, Score)
│   ├── routes/       # API routes (auth, quiz, user)
│   ├── seed.js       # Seed 30 questions into MongoDB
│   └── server.js     # Express entry point
└── frontend/         # React app
    └── src/
        ├── context/  # AuthContext (JWT state)
        ├── pages/    # Login, Dashboard, Quiz, Result, AuthCallback
        └── utils/    # Axios API helper
```

---

## ⚙️ Setup Instructions

### 1. Google OAuth Credentials
1. Go to https://console.cloud.google.com
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web Application)
4. Add Authorized redirect URI: `http://localhost:5000/auth/google/callback`
5. Copy your **Client ID** and **Client Secret**

### 2. MongoDB Atlas
1. Go to https://mongodb.com/atlas and create a free cluster
2. Get your connection string (replace `<username>` and `<password>`)

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your values
node seed.js         # Seed the database with 30 questions
npm run dev          # Start backend on port 5000
``

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000
npm start            # Start frontend on port 3000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/auth/me` | Get current user |
| GET | `/api/quiz/:difficulty` | Get questions (easy/medium/hard) |
| POST | `/api/quiz/submit` | Submit quiz score |
| GET | `/api/user/scores` | Get user's score history |

---

## 🚀 Deployment

**Frontend → Vercel/Netlify**
- Set `REACT_APP_API_URL` to your deployed backend URL

**Backend → Railway/Render/Heroku**
- Set all environment variables from `.env.example`
- Update Google OAuth redirect URI to your production backend URL

**Database → MongoDB Atlas** (already cloud-hosted)

---

## 🎮 Features
- ✅ Google OAuth 2.0 Login (Passport.js)
- ✅ JWT Authentication
- ✅ 3 Difficulty Levels: Easy / Medium / Hard
- ✅ 10 Questions per quiz, 10 options each
- ✅ Live countdown timer per question
- ✅ Auto-advance on timeout
- ✅ Real-time score calculation
- ✅ Score history saved to MongoDB
- ✅ Responsive UI
