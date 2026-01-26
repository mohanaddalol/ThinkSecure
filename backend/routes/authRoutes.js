import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";

const router = express.Router();

// ✅ Validation helper functions
const validateEmail = (email) => {
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Must be at least 8 characters, contain only English letters, numbers, and symbols
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  // Check for only ASCII printable characters (English letters, numbers, symbols)
  const asciiRegex = /^[\x20-\x7E]+$/;
  if (!asciiRegex.test(password)) {
    return { valid: false, message: "Password must contain only English letters, numbers, and symbols" };
  }
  return { valid: true };
};

// In-memory storage fallback (when DB is unavailable)
const inMemoryUsers = new Map();
let userIdCounter = 1;

// ✅ Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Try MongoDB first
    try {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(400).json({ message: "Email or username already in use" });
      }

      const hashed = await bcrypt.hash(password, 8);
      const user = await User.create({ username, email, password: hashed });

      res.status(201).json({
        message: "User created successfully",
        user: { id: user._id, username: user.username, email: user.email },
      });
    } catch (dbError) {
      // Fallback to in-memory storage
      console.log("⚠️ MongoDB unavailable, using in-memory storage");

      // Check for existing user in memory
      for (const [id, user] of inMemoryUsers) {
        if (user.email === email || user.username === username) {
          return res.status(400).json({ message: "Email or username already in use" });
        }
      }

      const hashed = await bcrypt.hash(password, 8);
      const userId = `temp-${userIdCounter++}`;
      inMemoryUsers.set(userId, { username, email, password: hashed });

      res.status(201).json({
        message: "User created successfully (in-memory mode)",
        user: { id: userId, username, email },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Signup route (alias for register - frontend compatibility)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Try MongoDB first
    try {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(400).json({ message: "Email or username already in use" });
      }

      const hashed = await bcrypt.hash(password, 8);
      const user = await User.create({ username, email, password: hashed });

      // Create leaderboard entry for new user (non-blocking)
      Leaderboard.create({
        userId: user._id,
        username: user.username,
        totalScore: 0,
        solvedChallenges: []
      }).catch(err => console.error('Leaderboard creation error:', err));

      // Generate JWT token immediately on signup
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "User created successfully",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
    } catch (dbError) {
      // Fallback to in-memory storage
      console.log("⚠️ MongoDB unavailable, using in-memory storage");

      // Check for existing user in memory
      for (const [id, user] of inMemoryUsers) {
        if (user.email === email || user.username === username) {
          return res.status(400).json({ message: "Email or username already in use" });
        }
      }

      const hashed = await bcrypt.hash(password, 10);
      const userId = `temp-${userIdCounter++}`;
      inMemoryUsers.set(userId, { username, email, password: hashed });

      res.status(201).json({
        message: "User created successfully (in-memory mode)",
        user: { id: userId, username, email },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Login existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 Login attempt for: ${email}`);

    // Validate
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Basic password check (don't reveal specific requirements on login)
    if (password.length < 8) {
      console.log("❌ Password too short");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Try MongoDB first
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found in DB");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log(`✅ Login successful for: ${email}`);
      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
    } catch (dbError) {
      // Fallback to in-memory storage
      console.log("⚠️ MongoDB unavailable, checking in-memory storage");

      let foundUser = null;
      let foundId = null;

      for (const [id, user] of inMemoryUsers) {
        if (user.email === email) {
          foundUser = user;
          foundId = id;
          break;
        }
      }

      if (!foundUser) {
        console.log(`❌ User not found: ${email}`);
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign(
        { id: foundId, username: foundUser.username, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log(`✅ Login successful (in-memory) for: ${email}`);
      res.json({
        message: "Login successful (in-memory mode)",
        token,
        user: { id: foundId, username: foundUser.username, email: foundUser.email },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
