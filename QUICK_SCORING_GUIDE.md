# Quick Implementation Guide for Challenge Components

This guide shows how to add scoring to any challenge component in ThinkSecure.

## Template Code

### 1. Import Required Functions
```javascript
import { submitChallenge } from './api';
```

### 2. Add Points Helper Function
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

### 3. Add Submission State
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);
```

### 4. Update Challenge Data Structure
Ensure each challenge has a `difficulty` field:
```javascript
const challenges = [
  {
    id: 1,
    title: 'Challenge Title',
    difficulty: 'Easy',  // or 'Medium', 'Hard', 'Advanced'
    flag: 'THINK{FLAG_HERE}',
    // ... other fields
  }
];
```

### 5. Replace handleSubmit Function

**Replace this:**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  if (userInput === correctAnswer) {
    setMessage('✅ Correct!');
  } else {
    setMessage('❌ Incorrect!');
  }
};
```

**With this:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const isCorrect = userInput === correctAnswer;
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    if (isCorrect) {
      setMessage('✅ Correct! Please log in to earn points.');
      setMessageType('success');
    } else {
      setMessage('❌ Incorrect. Try again!');
      setMessageType('error');
    }
    return;
  }
  
  // Submit to backend for scoring
  setIsSubmitting(true);
  try {
    const response = await submitChallenge(
      challenge.id.toString(),
      'YourCategoryName',  // e.g., 'Web', 'OSINT', 'Crypto'
      challenge.difficulty,
      isCorrect
    );
    
    if (response.alreadySolved) {
      setMessage('⚠️ You already solved this challenge!');
      setMessageType('warning');
    } else if (isCorrect && response.pointsEarned > 0) {
      setMessage(`🎉 Correct! You earned ${response.pointsEarned} points! Total: ${response.totalScore} points`);
      setMessageType('success');
    } else if (isCorrect) {
      setMessage('✅ Correct!');
      setMessageType('success');
    } else {
      setMessage('❌ Incorrect. Try again!');
      setMessageType('error');
    }
  } catch (error) {
    console.error('Submission error:', error);
    if (isCorrect) {
      setMessage('✅ Correct! (Score tracking unavailable)');
      setMessageType('success');
    } else {
      setMessage('❌ Incorrect. Try again!');
      setMessageType('error');
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

### 6. Display Points in Challenge Cards

**Add this to each challenge card:**
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

### 7. Display Points in Challenge Details

**Add this to the challenge details section:**
```jsx
<p>
  <strong>Difficulty:</strong> 
  <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
    {challenge.difficulty}
  </span>
</p>
<p>
  <strong>Points:</strong> 
  <span style={{color: '#00ff00', fontWeight: 'bold'}}>
    {getPoints(challenge.difficulty)} points
  </span>
</p>
```

### 8. Update Submit Button

**Add disabled state:**
```jsx
<button 
  type="submit" 
  className="submit-btn"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### 9. Add CSS for Points Badge

**Add to your component's CSS file:**
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

.flag-message.warning {
  background: rgba(255, 193, 7, 0.2);
  border-color: #ffc107;
  color: #ffc107;
}
```

---

## Category Names Reference

Use these exact category names when calling `submitChallenge()`:

| Component | Category Name |
|-----------|--------------|
| WebCTF.jsx | `"Web"` |
| OSINTCTF.jsx | `"OSINT"` |
| StegoCTF.jsx | `"Steganography"` |
| ForensicsCTF.jsx | `"Forensics"` |
| PasswordChallenge.jsx | `"Password"` |
| SecurityQuiz.jsx | `"Quiz"` |
| AttackSimulator.jsx | `"Attack Simulator"` |
| HackTheHacker.jsx | `"Hack The Hacker"` |
| CyberEscapeRoom.jsx | `"Escape Room"` |

---

## Complete Example for WebCTF.jsx

```javascript
import React, { useState } from 'react';
import './WebCTF.css';
import { submitChallenge } from './api';

const challenges = [
  {
    id: 1,
    title: 'SQL Injection Basic',
    difficulty: 'Easy',
    flag: 'THINK{SQL_MASTER}',
    description: 'Exploit SQL injection vulnerability...'
  },
  {
    id: 2,
    title: 'XSS Attack',
    difficulty: 'Medium',
    flag: 'THINK{XSS_FOUND}',
    description: 'Find and exploit XSS vulnerability...'
  }
];

const WebCTF = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPoints = (difficulty) => {
    const pointsMap = {
      'Easy': 10,
      'Medium': 25,
      'Hard': 50,
      'Advanced': 50
    };
    return pointsMap[difficulty] || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isCorrect = flagInput.trim() === selectedChallenge.flag;
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage(isCorrect ? '✅ Correct! Log in to earn points.' : '❌ Incorrect!');
      setMessageType(isCorrect ? 'success' : 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await submitChallenge(
        selectedChallenge.id.toString(),
        'Web',
        selectedChallenge.difficulty,
        isCorrect
      );
      
      if (response.alreadySolved) {
        setMessage('⚠️ You already solved this challenge!');
        setMessageType('warning');
      } else if (isCorrect && response.pointsEarned > 0) {
        setMessage(`🎉 Correct! You earned ${response.pointsEarned} points! Total: ${response.totalScore} points`);
        setMessageType('success');
      } else if (isCorrect) {
        setMessage('✅ Correct!');
        setMessageType('success');
      } else {
        setMessage('❌ Incorrect!');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage(isCorrect ? '✅ Correct!' : '❌ Incorrect!');
      setMessageType(isCorrect ? 'success' : 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of component
  
  return (
    <div className="web-ctf-container">
      {/* Challenge card with points badge */}
      <div className="challenge-card">
        <div className="challenge-badge">
          <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </span>
          <span className="points-badge">
            {getPoints(challenge.difficulty)} pts
          </span>
        </div>
        {/* ... */}
      </div>
      
      {/* Challenge details with points */}
      <div className="challenge-details">
        <p><strong>Difficulty:</strong> {selectedChallenge.difficulty}</p>
        <p>
          <strong>Points:</strong> 
          <span style={{color: '#00ff00', fontWeight: 'bold'}}>
            {getPoints(selectedChallenge.difficulty)} points
          </span>
        </p>
      </div>
      
      {/* Submit form */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={flagInput}
          onChange={(e) => setFlagInput(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Flag'}
        </button>
      </form>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default WebCTF;
```

---

## Testing Checklist

After implementing, verify:

- [ ] Points badge displays on challenge cards
- [ ] Points shown in challenge details
- [ ] Correct answer awards points (logged in users)
- [ ] Duplicate submission shows warning
- [ ] Non-logged-in users see "log in to earn points" message
- [ ] Loading state works during submission
- [ ] Error handling works when backend is down
- [ ] Navbar updates with new score (may need refresh)
- [ ] Leaderboard updates with new score

---

## Common Issues & Solutions

### Issue: Points not awarded
**Solution**: Check that:
- User is logged in (JWT token in localStorage)
- Backend server is running
- Category name matches exactly
- Challenge difficulty is valid (Easy/Medium/Hard/Advanced)

### Issue: "Already solved" message incorrect
**Solution**: Challenge IDs must be unique within each category

### Issue: Navbar doesn't update score
**Solution**: Refresh page or implement real-time updates with WebSocket/polling

### Issue: Backend returns 401 Unauthorized
**Solution**: JWT token expired or invalid - user needs to log in again

---

## Need Help?

See the full documentation: [SCORING_SYSTEM.md](./SCORING_SYSTEM.md)
