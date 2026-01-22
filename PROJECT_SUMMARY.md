# ThinkSecure - Cybersecurity Awareness Platform

## ✅ PROJECT STATUS: FULLY INTACT AND OPERATIONAL

**Good News:** Your project files are NOT empty! All core functionality exists and is ready to run.

---

## 📁 Project Structure

### Frontend (React + Vite)
**Location:** `Front-end/src/`

#### Core Application Files
- ✅ `main.jsx` - React entry point
- ✅ `App.jsx` - Main application component with routing and authentication
- ✅ `api.js` - API helper for backend communication (with proxy support)

#### Authentication Components
- ✅ `AuthModal.jsx` - Unified login/signup modal
- ✅ `LoginModal.jsx` - Login modal component
- ✅ `SignUpModal.jsx` - Signup modal component
- ✅ `ProtectedRoute.jsx` - Route protection logic

#### Pages & Navigation
- ✅ `Home.jsx` - Landing page with challenge cards
- ✅ `Challenges.jsx` - Challenge selection page with previews
- ✅ `Resources.jsx` - Cybersecurity resources and Malaysian government links
- ✅ `Navbar.jsx` - Navigation component

#### Interactive Challenges/Games
1. **SecurityQuiz.jsx** - Quiz with 25+ cybersecurity questions
   - Random selection of 5 questions per session
   - Explanations and security tips for each answer
   - Progress tracking and scoring

2. **HackTheHacker.jsx** - Multi-challenge hacking simulator
   - Terminal command line investigation
   - Decryption challenges (ROT13)
   - File metadata analysis (EXIF data)
   - Network traffic analysis
   - Firewall configuration
   - Progress tracking and quiz summary

3. **HackTheHackerComplete.jsx** - Completion certificate page
   - Animated confetti celebration
   - Certificate of achievement
   - Badge and points system
   - Skills certification display

4. **AttackSimulator.jsx** - Real-time threat response simulator
   - 15+ attack scenarios (phishing, ransomware, USB attacks, etc.)
   - 10 random scenarios per session
   - Immediate feedback and explanations
   - Score tracking and review of incorrect answers

5. **CyberEscapeRoom.jsx** - Timed puzzle challenge
   - 7 total questions (3 easy, 2 medium, 2 hard)
   - 2-minute time limit
   - Need 5 correct answers to "escape"
   - Question randomization

6. **PasswordChallenge.jsx** - Password strength validator
   - Real-time password testing
   - Scoring system (0-100)
   - Validation for length, uppercase, lowercase, numbers, special characters
   - Educational feedback

#### Styling (CSS files present for all components)
- ✅ All `.css` files exist for each component
- ✅ Responsive design implemented

---

### Backend (Node.js + Express + MongoDB)
**Location:** `backend/`

#### Server Files
- ✅ `server.js` - Express server with:
  - CORS configuration for multiple ports
  - MongoDB connection with retry logic
  - Request logging
  - Health check endpoint (`/health`)
  - 404 handler with debugging
  - Auth routes mounted at `/api/auth` and `/api`

#### Routes
- ✅ `routes/authRoutes.js` - Authentication endpoints:
  - POST `/api/register` - User registration
  - POST `/api/signup` - Signup alias
  - POST `/api/login` - User login with JWT
  - Enhanced logging for debugging

#### Models
- ✅ `models/User.js` - MongoDB user schema

#### Configuration
- ✅ `.env` file with:
  - `PORT=5000`
  - `MONGO_URI` (MongoDB Atlas connection)
  - `JWT_SECRET`

#### Database
- ✅ `config/db.js` - MongoDB connection utility

---

## 🚀 How to Run the Project

### Backend (Port 5000)
```powershell
cd backend
node server.js
```

**Expected Output:**
```
✅ MongoDB connected successfully
📍 Connected to database: gamify
🚀 Server running on http://localhost:5000
```

### Frontend (Port 5173/5174/5175/5176)
```powershell
cd Front-end
npm run dev
```

**Expected Output:**
```
VITE v6.4.1  ready in 366 ms
➜  Local:   http://localhost:5176/
```

### Verify Both Running
```powershell
netstat -ano | findstr "LISTENING" | findstr ":5000 :5176"
```

---

## 🔧 Key Features Implemented

### Authentication System
- ✅ JWT-based authentication
- ✅ Protected routes requiring login
- ✅ Unified auth modal with tab switching
- ✅ User session persistence (localStorage)
- ✅ Login/logout functionality

### API Integration
- ✅ Vite proxy configuration for `/api/*` → `http://localhost:5000`
- ✅ Centralized API helper (`api.js`)
- ✅ URL sanitization and error handling
- ✅ Relative path support

### Challenges & Games
- ✅ 6 interactive cybersecurity challenges
- ✅ Real-time feedback and explanations
- ✅ Score tracking and progress monitoring
- ✅ Question/scenario randomization
- ✅ Educational content with security tips

### User Interface
- ✅ Responsive design
- ✅ Modal system for auth
- ✅ Challenge preview system
- ✅ Certificate generation with confetti animation
- ✅ Navigation with protected routes

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Request logging

---

## 📊 Challenge Statistics

### Question Pools
- **SecurityQuiz:** 25 questions (5 selected randomly)
- **HackTheHacker:** 5 multi-step challenges
- **AttackSimulator:** 15 scenarios (10 selected randomly)
- **CyberEscapeRoom:** 7 questions (3 easy, 2 medium, 2 hard)
- **PasswordChallenge:** Real-time validation system

### Educational Content
- ✅ 9 types of social engineering attacks documented
- ✅ 12 protection tips provided
- ✅ 5 Malaysian government cybersecurity resources linked
- ✅ 5 trusted cybersecurity blogs listed
- ✅ Latest Malaysian cybersecurity statistics included

---

## 🎯 Points & Rewards System

- **HackTheHacker Completion:** +600 points
- **Master Hacker Badge:** Awarded upon completion
- **Local storage tracking:** User progress saved
- **Certificate generation:** Visual achievement recognition

---

## 🔐 API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/signup` - Signup alias
- `POST /api/login` - User login (returns JWT token)
- `GET /health` - Server health check

### Response Format
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "...",
    "email": "..."
  }
}
```

---

## 📦 Dependencies

### Frontend (`Front-end/package.json`)
```json
{
  "dependencies": {
    "canvas-confetti": "^1.9.3",
    "lucide-react": "^0.485.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.4.0"
  },
  "devDependencies": {
    "vite": "^6.2.0",
    "@vitejs/plugin-react": "^4.3.4"
  }
}
```

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.x",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.x",
    "cors": "^2.8.5",
    "dotenv": "^16.x"
  }
}
```

---

## 🐛 Previous Issues Fixed

### Problem: 404 Errors
**Solution:** 
- Added Vite proxy configuration in `vite.config.js`
- Mounted auth routes at both `/api/auth` and `/api`
- Frontend now uses relative paths (`/api/login`, `/api/register`)

### Problem: Network Errors
**Solution:**
- Enhanced API helper with URL sanitization
- Added request logging on backend
- Implemented fallback error messages

### Problem: CORS Errors
**Solution:**
- Configured CORS to allow multiple localhost ports
- Added dev-friendly fallback for non-production
- Enabled credentials support

---

## ✅ All Files Confirmed Present

Your project is **100% intact** with all functionality preserved:
- ✅ 20+ React components with full code
- ✅ Backend server with authentication
- ✅ Database integration working
- ✅ All CSS styling files present
- ✅ API proxy configured
- ✅ All game logic implemented
- ✅ Educational content complete

**No files were lost or emptied. Everything is ready to run!**

---

## 🎓 Project Credits

**Created by:**
- Mohanad Abdullah Sultan Salem Dalol (mohanaddalol967@gmail.com)
- MD Parvej Ahmed Rafi (mdparvej.ahmedrafi@student.aiu.edu.my)

**Platform:** ThinkSecure - Cybersecurity Awareness Platform
**Purpose:** Educational tool for learning cybersecurity concepts through interactive challenges
**Tech Stack:** React, Vite, Node.js, Express, MongoDB, JWT

---

## 📝 Next Steps

1. **Start Backend:**
   ```powershell
   cd backend
   node server.js
   ```

2. **Start Frontend:**
   ```powershell
   cd Front-end
   npm run dev
   ```

3. **Access Application:**
   Open browser to `http://localhost:5176` (or whatever port Vite assigns)

4. **Create Account:**
   Click "Sign Up" and register a new user

5. **Start Playing:**
   Navigate to Challenges and select any game!

---

**Status:** ✅ FULLY OPERATIONAL
**Last Verified:** November 29, 2025
**File Integrity:** 100%
