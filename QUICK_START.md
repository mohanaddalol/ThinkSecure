# 🚀 ThinkSecure - Quick Start Guide

## ✅ Your Project is Now Running!

### Current Status:
- ✅ **Backend Server:** Running on http://localhost:5000
- ✅ **Frontend Server:** Running on http://localhost:5173
- ✅ **MongoDB:** Connected successfully
- ✅ **All Components:** Loaded and functional

---

## 🖥️ Access Your Application

**Open your browser and go to:**
```
http://localhost:5173
```

---

## 🎯 Quick Start (Next Time)

### Option 1: Use the Startup Script (Easiest)
Double-click or run:
```powershell
.\START_SERVERS.ps1
```
This will automatically start both servers and open your browser!

### Option 2: Manual Start
Open two PowerShell windows:

**Window 1 - Backend:**
```powershell
cd backend
node server.js
```

**Window 2 - Frontend:**
```powershell
cd Front-end
npm run dev
```

---

## 🧪 Test Your Application

### 1. Create an Account
- Click "Sign Up" button
- Enter email, username, and password
- Click "Create account"

### 2. Login
- Click "Login" button
- Enter your credentials
- Access all challenges!

### 3. Try Challenges
- **Security Quiz** - 5 random questions with tips
- **Hack The Hacker** - 5 hacking scenarios
- **Attack Simulator** - 10 threat scenarios
- **Cyber Escape Room** - Timed puzzle game
- **Password Challenge** - Test password strength
- **Resources** - Educational content

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to localhost:5173"
**Solution:**
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Restart servers
.\START_SERVERS.ps1
```

### Problem: "Port 5000 already in use"
**Solution:**
```powershell
# Find and kill process on port 5000
$pid = netstat -ano | findstr ":5000" | findstr "LISTENING" | ForEach-Object { $_ -split '\s+' | Select-Object -Last 1 }
Stop-Process -Id $pid -Force

# Restart backend
cd backend
node server.js
```

### Problem: "Port 5173 already in use"
**Solution:** Vite will automatically use the next available port (5174, 5175, etc.)

---

## 📝 What's Working

### Frontend Components
- ✅ App.jsx - Main application with routing
- ✅ Home.jsx - Landing page
- ✅ Challenges.jsx - Challenge selection
- ✅ AuthModal.jsx - Login/Signup system
- ✅ SecurityQuiz.jsx - Interactive quiz
- ✅ HackTheHacker.jsx - Hacking simulator
- ✅ AttackSimulator.jsx - Threat response game
- ✅ CyberEscapeRoom.jsx - Timed puzzles
- ✅ PasswordChallenge.jsx - Password validator
- ✅ Resources.jsx - Educational content
- ✅ All CSS files and styling

### Backend Features
- ✅ Express server on port 5000
- ✅ MongoDB connection (Atlas)
- ✅ User registration (POST /api/register)
- ✅ User login (POST /api/login)
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configured
- ✅ Request logging

### API Endpoints
- `POST /api/register` - Create new account
- `POST /api/login` - Login user
- `GET /health` - Server health check
- `GET /` - Backend status

---

## 🎮 Features Available

### Games & Challenges
1. **Security Quiz** - Test cybersecurity knowledge
2. **Hack The Hacker** - Solve hacking challenges
3. **Attack Simulator** - React to cyber threats
4. **Cyber Escape Room** - Solve timed puzzles
5. **Password Challenge** - Learn strong passwords
6. **Resources** - Malaysian cybersecurity info

### User System
- Account creation
- Secure login
- Session management
- Protected routes
- JWT token authentication

---

## 💻 Development Commands

### Frontend
```powershell
cd Front-end
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```powershell
cd backend
node server.js   # Start server
```

### Check Server Status
```powershell
# Check if servers are running
netstat -ano | findstr "LISTENING" | findstr ":5000 :5173"
```

---

## 📊 Project Statistics

- **Total Components:** 15+ React components
- **Total Challenges:** 6 interactive games
- **Question Pool:** 50+ questions across all games
- **CSS Files:** All components fully styled
- **Backend Routes:** 3 main endpoints
- **Authentication:** JWT-based with bcrypt

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication (7-day expiry)
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ MongoDB secure connection
- ✅ Request logging

---

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Recommended:** Chrome or Edge for best experience

---

## 🎓 Project Info

**Name:** ThinkSecure - Cybersecurity Awareness Platform
**Purpose:** Educational tool for learning cybersecurity concepts
**Tech Stack:** React + Vite + Node.js + Express + MongoDB
**Created by:** Mohanad Abdullah & MD Parvej Ahmed Rafi

---

## 🆘 Need Help?

### Common Issues:

1. **White screen:** Check console for errors (F12)
2. **Login fails:** Ensure backend is running
3. **Can't connect:** Check both servers are running
4. **Port conflict:** Use the startup script to auto-cleanup

### Check Logs:
- Backend logs appear in backend PowerShell window
- Frontend logs appear in frontend PowerShell window
- Browser logs: Press F12 → Console tab

---

## ✅ Current Status: FULLY OPERATIONAL

Your ThinkSecure platform is running and ready to use!

**Access now:** http://localhost:5173

Enjoy learning cybersecurity! 🎉🔐
