# Leaderboard Separation Migration Guide

## What Changed?

Authentication data is now **completely separated** from leaderboard/scoring data:

### Before:
- ❌ `users` collection stored both auth data AND scores
- ❌ Risk of exposing sensitive data in leaderboard queries
- ❌ Tight coupling between auth and scoring

### After:
- ✅ `users` collection = **authentication only** (email, password, JWT)
- ✅ `leaderboards` collection = **scoring only** (points, challenges, ranks)
- ✅ Clean separation via `userId` reference
- ✅ Ranks calculated dynamically (never stored in DB)

---

## File Structure

### New Files Created:
```
backend/
├── models/
│   └── Leaderboard.js                 ← NEW: Separate scoring model
├── migrations/
│   └── migrateToLeaderboard.js        ← NEW: One-time migration script
└── routes/
    ├── challengeRoutes.js             ← MODIFIED: Now uses Leaderboard model
    └── authRoutes.js                  ← MODIFIED: Creates leaderboard on signup
```

### Frontend (No Changes Needed):
- `Front-end/src/Leaderboard.jsx` - Already compatible
- `Front-end/src/api.js` - Already compatible

---

## How It Works

### 1. User Registration (`authRoutes.js`)
```javascript
// When user signs up:
const user = await User.create({ username, email, password: hashed });

// Automatically create leaderboard entry with 0 points:
await Leaderboard.create({
  userId: user._id,
  username: user.username,
  totalScore: 0,
  solvedChallenges: []
});
```

### 2. Challenge Submission (`challengeRoutes.js`)
```javascript
// When user solves a challenge:
const leaderboardEntry = await Leaderboard.findOne({ userId });

// Check for duplicates (prevent double scoring):
const alreadySolved = leaderboardEntry.solvedChallenges.some(...);

// Add points ONLY to leaderboard (not users collection):
leaderboardEntry.totalScore += points;
await leaderboardEntry.save();
```

### 3. Leaderboard Display
```javascript
// Fetch sorted entries:
const entries = await Leaderboard.find()
  .sort({ totalScore: -1, createdAt: 1 })
  .limit(100);

// Ranks calculated dynamically:
const leaderboard = entries.map((entry, index) => ({
  rank: index + 1,  // ← NOT stored in DB
  username: entry.username,
  score: entry.totalScore
}));
```

---

## Migration for Existing Users

### Run Migration Script (One Time Only):
```bash
cd backend
node migrations/migrateToLeaderboard.js
```

**What it does:**
1. Connects to your MongoDB
2. Finds all existing users
3. Creates leaderboard entries for each user
4. Copies `totalScore` and `solvedChallenges` from `users` to `leaderboards`
5. Skips users who already have leaderboard entries (safe to re-run)

**Output:**
```
🔄 Starting migration to Leaderboard collection...
✅ Connected to MongoDB

📊 Found 3 users to migrate

✅ Migrated: mohanad - 10 points, 1 challenges
✅ Migrated: alice - 0 points, 0 challenges
✅ Migrated: bob - 25 points, 2 challenges

📊 Migration Summary:
   ✅ Migrated: 3
   ⏭️  Skipped:  0
   ❌ Errors:   0
   📊 Total:    3
```

---

## Deploy to Render

### Step 1: Commit Changes
```bash
git add .
git commit -m "Separate auth and leaderboard data"
git push
```

### Step 2: Run Migration on Render
After backend deploys, open Render Shell and run:
```bash
node migrations/migrateToLeaderboard.js
```

---

## Data Model

### Leaderboard Schema:
```javascript
{
  userId: ObjectId,              // References User._id
  username: String,              // Duplicated for fast queries
  totalScore: Number,            // Default: 0
  solvedChallenges: [{
    challengeId: String,
    category: String,            // 'Web', 'OSINT', etc.
    difficulty: String,          // 'Easy', 'Medium', 'Hard', 'Advanced'
    points: Number,              // 10, 25, or 50
    solvedAt: Date
  }],
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes:
- `{ totalScore: -1, createdAt: 1 }` - Fast sorting for leaderboard
- `{ userId: 1 }` - Unique constraint, fast user lookups

---

## Security Benefits

### Before (Risky):
```javascript
// Exposed ALL user data in leaderboard:
const users = await User.find().select('username email totalScore');
// Could accidentally leak emails or password hashes
```

### After (Secure):
```javascript
// Only leaderboard data exposed:
const entries = await Leaderboard.find().select('username totalScore');
// No access to auth data (email, password) whatsoever
```

---

## Testing

### 1. Test New User Registration:
```bash
curl -X POST https://thinksecure.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

Check MongoDB - should create:
- 1 entry in `users` collection
- 1 entry in `leaderboards` collection with 0 points

### 2. Test Challenge Submission:
```bash
curl -X POST https://thinksecure.onrender.com/api/challenges/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"challengeId":"quiz_1","category":"Quiz","difficulty":"Easy","isCorrect":true}'
```

Check `leaderboards` collection - `totalScore` should increase by 10.

### 3. Test Leaderboard:
```bash
curl https://thinksecure.onrender.com/api/challenges/leaderboard
```

Should return sorted users with dynamically calculated ranks.

---

## Rollback Plan (If Needed)

If something breaks, you can temporarily revert to the old system:

1. **Restore old challengeRoutes.js:**
   ```bash
   git checkout HEAD~1 -- backend/routes/challengeRoutes.js
   ```

2. **Keep using User model** until you fix the issue

3. **Re-run migration** once fixed

---

## FAQ

**Q: Will existing users lose their scores?**  
A: No! The migration script copies all scores from `users` to `leaderboards`.

**Q: Do I need to update the frontend?**  
A: No, the API response format is identical.

**Q: What if migration fails halfway?**  
A: Safe to re-run - it skips users who already have leaderboard entries.

**Q: Can I delete scores from users collection?**  
A: Yes, after verifying migration. But it's safer to leave them as backup.

**Q: How do I add backend answer validation?**  
A: Edit the `validateAnswer()` function in `challengeRoutes.js` to add correct answers for each challenge.

---

## Production Checklist

- [ ] Run migration script on production database
- [ ] Verify leaderboard displays correctly
- [ ] Test new user registration creates leaderboard entry
- [ ] Test challenge submission updates leaderboard
- [ ] Check MongoDB indexes are created
- [ ] Monitor Render logs for errors
- [ ] Backup database before migration (recommended)

---

## Support

If you encounter issues:
1. Check Render backend logs
2. Verify MongoDB connection
3. Ensure migration script completed successfully
4. Test API endpoints with curl/Postman
