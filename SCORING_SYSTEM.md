# ThinkSecure Scoring & Leaderboard System

## Overview

The ThinkSecure platform now includes a comprehensive scoring and leaderboard system that tracks user progress across all challenge categories.

## Scoring Rules

### Points per Challenge Difficulty:
- **Easy challenges**: 10 points per question
- **Medium challenges**: 25 points per question
- **Hard challenges**: 50 points per question
- **Advanced challenges**: 50 points per question (treated as Hard)

### Key Features:
✅ **Immediate Points Award**: Users earn points immediately after correctly solving a challenge  
✅ **Cumulative Scoring**: Points accumulate across all challenge boxes and categories  
✅ **No Duplicate Points**: Each challenge can only be solved once per user  
✅ **Tiebreaker System**: Users with the same score are ranked by who completed challenges earlier  
✅ **Real-time Tracking**: All progress is tracked in MongoDB with timestamps  

---

## Backend Architecture

### 1. User Model (`backend/models/User.js`)

Enhanced with scoring fields:

```javascript
{
  username: String,
  email: String,
  password: String,
  totalScore: Number (default: 0),
  solvedChallenges: [
    {
      challengeId: String,
      category: String,      // Web, OSINT, Stego, etc.
      difficulty: String,    // Easy, Medium, Hard, Advanced
      points: Number,
      solvedAt: Date
    }
  ]
}
```

### 2. Challenge Routes (`backend/routes/challengeRoutes.js`)

#### POST `/api/challenges/submit`
Submits a challenge solution and awards points.

**Request Body:**
```json
{
  "challengeId": "1",
  "category": "Steganography",
  "difficulty": "Easy",
  "isCorrect": true
}
```

**Response (Success):**
```json
{
  "message": "🎉 Correct! You earned 10 points!",
  "pointsEarned": 10,
  "totalScore": 135,
  "difficulty": "Easy",
  "alreadySolved": false
}
```

**Response (Already Solved):**
```json
{
  "message": "You've already solved this challenge!",
  "pointsEarned": 0,
  "totalScore": 135,
  "alreadySolved": true
}
```

#### GET `/api/challenges/leaderboard`
Retrieves the global leaderboard.

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "CyberMaster",
      "score": 450,
      "challengesSolved": 18,
      "lastSolved": "2026-01-26T10:30:00Z"
    }
  ],
  "total": 50
}
```

#### GET `/api/challenges/progress`
Retrieves user's personal progress and statistics (requires authentication).

**Response:**
```json
{
  "username": "CyberMaster",
  "totalScore": 450,
  "totalChallengesSolved": 18,
  "statsByDifficulty": {
    "Easy": { "count": 8, "points": 80 },
    "Medium": { "count": 7, "points": 175 },
    "Hard": { "count": 3, "points": 150 }
  },
  "statsByCategory": {
    "Steganography": { "count": 5, "points": 95 },
    "Web": { "count": 6, "points": 140 }
  },
  "recentSolves": [...]
}
```

### 3. Authentication Middleware (`backend/middleware/auth.js`)

Protects routes and validates JWT tokens:
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature
- Attaches user info to request object

---

## Frontend Integration

### 1. API Helper (`Front-end/src/api.js`)

New functions added:

```javascript
// Submit challenge solution
await submitChallenge(challengeId, category, difficulty, isCorrect);

// Get user progress
await getUserProgress();
```

### 2. Leaderboard Component (`Front-end/src/Leaderboard.jsx`)

- Fetches real-time data from `/api/challenges/leaderboard`
- Displays top 3 on podium
- Shows full ranking table with:
  - Rank
  - Username
  - Total Score
  - Challenges Solved

### 3. Challenge Components (Example: `StegoCTF.jsx`)

#### Key Changes:

**Import the submission function:**
```javascript
import { submitChallenge } from './api';
```

**Add points display function:**
```javascript
const getPoints = (difficulty) => {
  const pointsMap = {
    'Easy': 10,
    'Medium': 25,
    'Hard': 50,
    'Advanced': 50
  };
  return pointsMap[difficulty] || 0;
};
```

**Update handleSubmit to call backend:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const isCorrect = flagInput.trim() === selectedChallenge.flag;
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Handle non-logged-in users
    setMessage(isCorrect ? '✅ Correct! Log in to earn points.' : '❌ Incorrect');
    return;
  }
  
  try {
    const response = await submitChallenge(
      selectedChallenge.id.toString(),
      'Steganography',  // Category name
      selectedChallenge.difficulty,
      isCorrect
    );
    
    if (response.pointsEarned > 0) {
      setMessage(`🎉 You earned ${response.pointsEarned} points! Total: ${response.totalScore}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

**Display points in challenge cards:**
```jsx
<div className="challenge-badge">
  <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
    {challenge.difficulty}
  </span>
  <span className="points-badge">
    {getPoints(challenge.difficulty)} pts
  </span>
</div>
```

**Display points in challenge details:**
```jsx
<strong>Points:</strong> 
<span style={{color: '#00ff00', fontWeight: 'bold'}}>
  {getPoints(selectedChallenge.difficulty)} points
</span>
```

---

## How to Apply Scoring to Other Challenge Components

### Step-by-Step Guide:

1. **Import the submission function**
   ```javascript
   import { submitChallenge } from './api';
   ```

2. **Add the getPoints helper function**
   ```javascript
   const getPoints = (difficulty) => {
     const pointsMap = {
       'Easy': 10,
       'Medium': 25,
       'Hard': 50,
       'Advanced': 50
     };
     return pointsMap[difficulty] || 0;
   };
   ```

3. **Update your challenge data structure** to include `difficulty` field
   ```javascript
   const challenges = [
     {
       id: 1,
       title: 'SQL Injection',
       difficulty: 'Medium',  // Add this
       flag: 'THINK{SQL_MASTER}',
       // ... other fields
     }
   ];
   ```

4. **Modify handleSubmit function** to call the backend
   ```javascript
   const handleSubmit = async (e) => {
     e.preventDefault();
     const isCorrect = userInput === challenge.correctAnswer;
     
     const token = localStorage.getItem('token');
     if (!token) {
       setMessage(isCorrect ? '✅ Correct! Log in to earn points.' : '❌ Incorrect');
       return;
     }
     
     try {
       const response = await submitChallenge(
         challenge.id.toString(),
         'CategoryName',  // e.g., 'Web', 'OSINT', 'Crypto'
         challenge.difficulty,
         isCorrect
       );
       
       if (response.pointsEarned > 0) {
         setMessage(`🎉 Correct! You earned ${response.pointsEarned} points! Total: ${response.totalScore} points`);
       } else if (response.alreadySolved) {
         setMessage('⚠️ You already solved this challenge!');
       }
     } catch (error) {
       console.error('Submission error:', error);
       setMessage(isCorrect ? '✅ Correct!' : '❌ Incorrect');
     }
   };
   ```

5. **Display points in the UI** (challenge cards and details)

6. **Add loading state** for better UX
   ```javascript
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   // In handleSubmit:
   setIsSubmitting(true);
   try {
     // ... submission logic
   } finally {
     setIsSubmitting(false);
   }
   ```

---

## Challenge Categories

When calling `submitChallenge()`, use these category names:

- **Web** - Web exploitation challenges (WebCTF.jsx)
- **OSINT** - Open Source Intelligence (OSINTCTF.jsx)
- **Steganography** - Stego challenges (StegoCTF.jsx)
- **Forensics** - Digital forensics (ForensicsCTF.jsx)
- **Crypto** - Cryptography challenges
- **Password** - Password cracking (PasswordChallenge.jsx)
- **Quiz** - Security quiz (SecurityQuiz.jsx)
- **Attack Simulator** - Attack simulations (AttackSimulator.jsx)
- **Hack The Hacker** - Reverse hacking (HackTheHacker.jsx)
- **Escape Room** - Cyber escape room (CyberEscapeRoom.jsx)

---

## Testing the System

### 1. Register a new user:
```bash
POST http://localhost:5000/api/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login:
```bash
POST http://localhost:5000/api/login
{
  "email": "test@example.com",
  "password": "password123"
}
```
Save the returned `token`.

### 3. Submit a challenge:
```bash
POST http://localhost:5000/api/challenges/submit
Headers: { "Authorization": "Bearer <token>" }
{
  "challengeId": "1",
  "category": "Steganography",
  "difficulty": "Easy",
  "isCorrect": true
}
```

### 4. Check leaderboard:
```bash
GET http://localhost:5000/api/challenges/leaderboard
```

### 5. View user progress:
```bash
GET http://localhost:5000/api/challenges/progress
Headers: { "Authorization": "Bearer <token>" }
```

---

## Database Schema

The scoring system uses MongoDB with the following collections:

### Users Collection:
```javascript
{
  _id: ObjectId,
  username: "CyberMaster",
  email: "cyber@example.com",
  password: "$2a$10$...", // hashed
  totalScore: 450,
  solvedChallenges: [
    {
      challengeId: "1",
      category: "Steganography",
      difficulty: "Easy",
      points: 10,
      solvedAt: ISODate("2026-01-26T10:30:00Z")
    }
  ],
  createdAt: ISODate("2026-01-20T08:00:00Z"),
  updatedAt: ISODate("2026-01-26T10:30:00Z")
}
```

---

## Environment Variables

Make sure these are set in your `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/thinksecure
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
```

---

## CSS Styling for Points Display

Add these styles to your challenge component's CSS file:

```css
.points-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid #00ff00;
}

.challenge-badge {
  display: flex;
  gap: 10px;
  align-items: center;
}

.flag-message-stego.warning {
  background: rgba(255, 193, 7, 0.2);
  border-color: #ffc107;
  color: #ffc107;
}
```

---

## Security Considerations

✅ **JWT Authentication**: All scoring endpoints require valid JWT tokens  
✅ **Duplicate Prevention**: Backend checks if challenge was already solved  
✅ **Input Validation**: All inputs are validated before processing  
✅ **Error Handling**: Graceful fallbacks if backend is unavailable  
✅ **CORS Protection**: Only allowed origins can access the API  

---

## Future Enhancements

Potential features to add:
- [ ] Achievement badges for milestones
- [ ] Category-specific leaderboards
- [ ] Weekly/monthly leaderboard resets
- [ ] Point multipliers for streaks
- [ ] Team competitions
- [ ] Challenge hints that reduce points
- [ ] Time-based scoring (faster solves = more points)

---

## Support

For issues or questions about the scoring system:
1. Check the console logs for error messages
2. Verify the backend is running (`http://localhost:5000/health`)
3. Ensure MongoDB connection is active
4. Check that JWT token is valid and not expired
5. Review the network requests in browser DevTools

---

**System implemented on**: January 26, 2026  
**Backend Routes**: `/api/challenges/*`  
**Database**: MongoDB (thinksecure database)  
**Authentication**: JWT Bearer tokens
