import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: false }, // Not required for Google OAuth users
    // Google OAuth fields
    googleId: { type: String, sparse: true, unique: true }, // Google user ID
    provider: { type: String, default: "local" }, // "local" or "google"
    avatar: { type: String }, // Profile picture URL from Google
    totalScore: { type: Number, default: 0 },
    solvedChallenges: [
      {
        challengeId: { type: String, required: true },
        category: { type: String, required: true }, // Web, OSINT, Stego, etc.
        difficulty: { type: String, required: true }, // Easy, Medium, Hard
        points: { type: Number, required: true },
        solvedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
