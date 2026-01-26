import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Points mapping based on difficulty
const POINTS_MAP = {
           Easy: 10,
           Medium: 25,
           Hard: 50,
           Advanced: 50 // Advanced is treated as Hard (50 points)
};

// ✅ Submit a challenge solution
router.post("/submit", authenticateToken, async (req, res) => {
           try {
                      const { challengeId, category, difficulty, isCorrect } = req.body;
                      const userId = req.user.id;

                      // Validate input
                      if (!challengeId || !category || !difficulty || isCorrect === undefined) {
                                 return res.status(400).json({
                                            message: "Missing required fields: challengeId, category, difficulty, isCorrect"
                                 });
                      }

                      // Only process if answer is correct
                      if (!isCorrect) {
                                 return res.json({
                                            message: "Incorrect answer. Try again!",
                                            pointsEarned: 0,
                                            totalScore: null
                                 });
                      }

                      // Calculate points based on difficulty
                      const points = POINTS_MAP[difficulty] || 0;

                      if (points === 0) {
                                 return res.status(400).json({
                                            message: `Invalid difficulty level: ${difficulty}. Must be Easy, Medium, Hard, or Advanced.`
                                 });
                      }

                      try {
                                 // Find user in database
                                 const user = await User.findById(userId);

                                 if (!user) {
                                            return res.status(404).json({ message: "User not found" });
                                 }

                                 // Check if challenge already solved
                                 const alreadySolved = user.solvedChallenges.some(
                                            (challenge) =>
                                                       challenge.challengeId === challengeId &&
                                                       challenge.category === category
                                 );

                                 if (alreadySolved) {
                                            return res.json({
                                                       message: "You've already solved this challenge!",
                                                       pointsEarned: 0,
                                                       totalScore: user.totalScore,
                                                       alreadySolved: true
                                            });
                                 }

                                 // Add challenge to solved list and update score
                                 user.solvedChallenges.push({
                                            challengeId,
                                            category,
                                            difficulty,
                                            points,
                                            solvedAt: new Date()
                                 });

                                 user.totalScore += points;
                                 await user.save();

                                 console.log(`✅ User ${user.username} earned ${points} points for ${category} challenge #${challengeId}`);

                                 res.json({
                                            message: `🎉 Correct! You earned ${points} points!`,
                                            pointsEarned: points,
                                            totalScore: user.totalScore,
                                            difficulty,
                                            alreadySolved: false
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

// ✅ Get leaderboard
router.get("/leaderboard", async (req, res) => {
           try {
                      // Fetch all users sorted by totalScore (descending) and createdAt (ascending for tie-breaking)
                      const users = await User.find()
                                 .select("username totalScore solvedChallenges createdAt")
                                 .sort({ totalScore: -1, createdAt: 1 })
                                 .limit(100);

                      // Format leaderboard data with ranks
                      const leaderboard = users.map((user, index) => ({
                                 rank: index + 1,
                                 username: user.username,
                                 score: user.totalScore,
                                 challengesSolved: user.solvedChallenges.length,
                                 lastSolved: user.solvedChallenges.length > 0
                                            ? user.solvedChallenges[user.solvedChallenges.length - 1].solvedAt
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
                      const user = await User.findById(userId).select("username totalScore solvedChallenges");

                      if (!user) {
                                 return res.status(404).json({ message: "User not found" });
                      }

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
