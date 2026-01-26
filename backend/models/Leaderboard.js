import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
           userId: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: 'User',
                      required: true,
                      unique: true // One leaderboard entry per user
           },
           username: {
                      type: String,
                      required: true
           },
           totalScore: {
                      type: Number,
                      default: 0,
                      min: 0
           },
           solvedChallenges: [{
                      challengeId: {
                                 type: String,
                                 required: true
                      },
                      category: {
                                 type: String,
                                 required: true,
                                 enum: ['Web', 'OSINT', 'Steganography', 'Forensics', 'Quiz', 'Password', 'Attack Simulator', 'Hack The Hacker', 'Cyber Escape Room']
                      },
                      difficulty: {
                                 type: String,
                                 required: true,
                                 enum: ['Easy', 'Medium', 'Hard', 'Advanced']
                      },
                      points: {
                                 type: Number,
                                 required: true
                      },
                      solvedAt: {
                                 type: Date,
                                 default: Date.now
                      }
           }],
           lastUpdated: {
                      type: Date,
                      default: Date.now
           }
}, {
           timestamps: true
});

// Index for fast sorting by score
leaderboardSchema.index({ totalScore: -1, createdAt: 1 });

// Index for userId lookups
leaderboardSchema.index({ userId: 1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
