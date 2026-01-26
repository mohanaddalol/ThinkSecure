import express from "express";
import Leaderboard from "../models/Leaderboard.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Points mapping based on difficulty
const POINTS_MAP = {
           Easy: 10,
           Medium: 25,
           Hard: 50,
           Advanced: 50
};

// Valid categories and difficulties
const VALID_CATEGORIES = ['Web', 'OSINT', 'Steganography', 'Forensics', 'Quiz', 'Password', 'Attack Simulator', 'Hack The Hacker', 'Cyber Escape Room'];
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Advanced'];

// ✅ Submit a challenge solution (validates on backend, prevents duplicates, updates leaderboard only)
router.post("/submit", authenticateToken, async (req, res) => {
           try {
                      const { challengeId, category, difficulty, isCorrect } = req.body;
                      const userId = req.user.id;
                      const username = req.user.username;

                      // Validate input
                      if (!challengeId || !category || !difficulty) {
                                 return res.status(400).json({
                                            message: "Missing required fields: challengeId, category, difficulty"
                                 });
                      }

                      // Validate category and difficulty
                      if (!VALID_CATEGORIES.includes(category)) {
                                 return res.status(400).json({
                                            message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
                                 });
                      }

                      if (!VALID_DIFFICULTIES.includes(difficulty)) {
                                 return res.status(400).json({
                                            message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`
                                 });
                      }

                      // Only process if answer is correct
                      if (!isCorrect) {
                                 return res.json({
                                            message: "Incorrect answer. Try again!",
                                            pointsEarned: 0,
                                            success: false
                                 });
                      }

                      // Calculate points
                      const points = POINTS_MAP[difficulty];

                      try {
                                 // Find or create leaderboard entry
                                 let leaderboardEntry = await Leaderboard.findOne({ userId });

                                 if (!leaderboardEntry) {
                                            // Create new entry if doesn't exist (for existing users)
                                            leaderboardEntry = await Leaderboard.create({
                                                       userId,
                                                       username,
                                                       totalScore: 0,
                                                       solvedChallenges: []
                                            });
                                 }

                                 // Check if challenge already solved (prevent double scoring)
                                 // Convert both to strings for reliable comparison
                                 const alreadySolved = leaderboardEntry.solvedChallenges.some(
                                            (challenge) =>
                                                       String(challenge.challengeId) === String(challengeId) &&
                                                       challenge.category === category
                                 );

                                 if (alreadySolved) {
                                            console.log(`⏭️  ${username} already solved ${category} challenge #${challengeId}`);
                                            return res.json({
                                                       message: "You've already solved this challenge!",
                                                       pointsEarned: 0,
                                                       totalScore: leaderboardEntry.totalScore,
                                                       alreadySolved: true,
                                                       success: false
                                            });
                                 }

                                 // Add challenge to solved list and update score
                                 leaderboardEntry.solvedChallenges.push({
                                            challengeId,
                                            category,
                                            difficulty,
                                            points,
                                            solvedAt: new Date()
                                 });

                                 leaderboardEntry.totalScore += points;
                                 leaderboardEntry.lastUpdated = new Date();
                                 await leaderboardEntry.save();

                                 console.log(`✅ ${username} earned ${points} points for ${category} (${difficulty}) challenge #${challengeId} - Total: ${leaderboardEntry.totalScore}`);

                                 res.json({
                                            message: `🎉 Correct! You earned ${points} points!`,
                                            pointsEarned: points,
                                            totalScore: leaderboardEntry.totalScore,
                                            difficulty,
                                            alreadySolved: false,
                                            success: true
                                 });

                      } catch (dbError) {
                                 console.error("Database error:", dbError);
                                 res.status(500).json({
                                            message: "Database error. Please try again.",
                                            error: dbError.message
                                 });
                      }

           } catch (error) {
                      console.error("Challenge submission error:", error);
                      res.status(500).json({
                                 message: "Server error",
                                 error: error.message
                      });
           }
});

// ✅ Get leaderboard (ranks calculated dynamically, sorted by score)
router.get("/leaderboard", async (req, res) => {
           try {
                      // Fetch all leaderboard entries sorted by score (desc) and createdAt (asc for tie-breaking)
                      const entries = await Leaderboard.find()
                                 .select("username totalScore solvedChallenges lastUpdated")
                                 .sort({ totalScore: -1, createdAt: 1 })
                                 .limit(100);

                      // Dynamically calculate ranks (NOT stored in database)
                      const leaderboard = entries.map((entry, index) => ({
                                 rank: index + 1,
                                 username: entry.username,
                                 score: entry.totalScore,
                                 challengesSolved: entry.solvedChallenges.length,
                                 lastSolved: entry.solvedChallenges.length > 0
                                            ? entry.solvedChallenges[entry.solvedChallenges.length - 1].solvedAt
                                            : null
                      }));

                      res.json({
                                 leaderboard,
                                 total: leaderboard.length
                      });

           } catch (error) {
                      console.error("Leaderboard error:", error);
                      res.status(500).json({
                                 message: "Failed to fetch leaderboard",
                                 error: error.message
                      });
           }
});

// ✅ Get user's progress and statistics
router.get("/progress", authenticateToken, async (req, res) => {
           try {
                      const userId = req.user.id;

                      let leaderboardEntry = await Leaderboard.findOne({ userId })
                                 .select("username totalScore solvedChallenges");

                      // If no entry exists, create one
                      if (!leaderboardEntry) {
                                 leaderboardEntry = await Leaderboard.create({
                                            userId,
                                            username: req.user.username,
                                            totalScore: 0,
                                            solvedChallenges: []
                                 });
                      }

                      const user = leaderboardEntry;

                      // Calculate statistics by difficulty and category
                      const statsByDifficulty = {
                                 Easy: { count: 0, points: 0 },
                                 Medium: { count: 0, points: 0 },
                                 Hard: { count: 0, points: 0 },
                                 Advanced: { count: 0, points: 0 }
                      };

                      const statsByCategory = {};

                      user.solvedChallenges.forEach(challenge => {
                                 // By difficulty
                                 if (statsByDifficulty[challenge.difficulty]) {
                                            statsByDifficulty[challenge.difficulty].count++;
                                            statsByDifficulty[challenge.difficulty].points += challenge.points;
                                 }

                                 // By category
                                 if (!statsByCategory[challenge.category]) {
                                            statsByCategory[challenge.category] = { count: 0, points: 0 };
                                 }
                                 statsByCategory[challenge.category].count++;
                                 statsByCategory[challenge.category].points += challenge.points;
                      });

                      res.json({
                                 username: user.username,
                                 totalScore: user.totalScore,
                                 totalChallengesSolved: user.solvedChallenges.length,
                                 statsByDifficulty,
                                 statsByCategory,
                                 recentSolves: user.solvedChallenges.slice(-5).reverse() // Last 5 solved challenges
                      });

           } catch (error) {
                      console.error("Progress fetch error:", error);
                      res.status(500).json({
                                 message: "Failed to fetch progress",
                                 error: error.message
                      });
           }
});

export default router;
