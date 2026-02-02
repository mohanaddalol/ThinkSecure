import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import { sendPasswordResetEmail, sendPasswordResetConfirmation, sendVerificationEmail } from "../config/email.js";

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

      const hashed = await bcrypt.hash(password, 4);
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
      const existing = await User.findOne({ $or: [{ email }, { username }] }).lean().select('_id');
      if (existing) {
        return res.status(400).json({
          message: "Email or username already in use"
        });
      }

      const hashed = await bcrypt.hash(password, 4);

      const user = await User.create({
        username,
        email,
        password: hashed,
        isEmailVerified: true
      });

      // Create leaderboard entry for new user (non-blocking)
      setImmediate(() => {
        Leaderboard.create({
          userId: user._id,
          username: user.username,
          totalScore: 0,
          solvedChallenges: []
        }).catch(err => console.error('Leaderboard creation error:', err));
      });

      // Generate JWT token immediately
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "User created successfully",
        token,
        user: { id: user._id, username: user.username, email: user.email }
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

      const hashed = await bcrypt.hash(password, 4);
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
      const user = await User.findOne({ email }).select('_id username email password').lean();
      if (!user) {
        console.log(`❌ User not found: ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
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
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
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

// ✅ Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Don't reveal if email exists (security best practice)
    if (!user) {
      console.log(`⚠️ Password reset requested for non-existent email: ${email}`);
      return res.json({
        message: "If an account exists with this email, you will receive a password reset link shortly."
      });
    }

    // Check if user uses Google OAuth (no password to reset)
    if (user.provider === 'google' && !user.password) {
      console.log(`⚠️ Password reset requested for Google OAuth user: ${email}`);
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please log in with Google instead."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before saving to database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiration to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with unhashed token
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.username);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return res.status(500).json({
        message: "Failed to send reset email. Please try again later."
      });
    }

    console.log(`✅ Password reset email sent to: ${email}`);
    res.json({
      message: "If an account exists with this email, you will receive a password reset link shortly."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Validate new password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Hash the token from URL to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      console.log('❌ Invalid or expired reset token');
      return res.status(400).json({
        message: "Invalid or expired reset token. Please request a new password reset."
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 4);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordResetConfirmation(user.email, user.username);

    console.log(`✅ Password reset successful for: ${user.email}`);
    res.json({
      message: "Password reset successful! You can now log in with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Verify email with token
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('❌ Invalid or expired verification token');
      return res.status(400).json({
        message: "Invalid or expired verification link. Please request a new one."
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log(`✅ Email verified for: ${user.email}`);
    res.json({
      message: "Email verified successfully! You can now log in.",
      verified: true
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: "If an account exists, a verification email has been sent." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = tokenExpiry;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, verificationToken, user.username);

    console.log(`✅ Verification email resent to: ${email}`);
    res.json({ message: "Verification email sent! Please check your inbox." });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
