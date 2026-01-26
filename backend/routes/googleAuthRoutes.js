import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";

const router = express.Router();

// ✅ Initiate Google OAuth login
router.get(
           "/google",
           passport.authenticate("google", {
                      scope: ["profile", "email"],
                      session: false, // We're using JWT, not sessions
           })
);

// ✅ Google OAuth callback route
router.get(
           "/google/callback",
           passport.authenticate("google", {
                      session: false,
                      failureRedirect: process.env.FRONTEND_URL || "http://localhost:5173/login?error=oauth_failed",
           }),
           (req, res) => {
                      try {
                                 // User authenticated successfully, create JWT
                                 const token = jwt.sign(
                                            {
                                                       id: req.user._id,
                                                       username: req.user.username,
                                                       email: req.user.email,
                                                       provider: req.user.provider,
                                            },
                                            process.env.JWT_SECRET,
                                            { expiresIn: "7d" }
                                 );

                                 // Redirect to frontend with token in URL
                                 const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
                                 res.redirect(`${frontendURL}/auth/callback?token=${token}`);
                      } catch (error) {
                                 console.error("❌ Error creating JWT after Google auth:", error);
                                 const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
                                 res.redirect(`${frontendURL}/login?error=token_failed`);
                      }
           }
);

export default router;
