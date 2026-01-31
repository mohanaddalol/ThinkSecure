import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleOAuthConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// ✅ Initiate Google OAuth login
router.get(
           "/google",
           (req, res, next) => {
                      if (!isGoogleOAuthConfigured) {
                                 return res.status(503).json({
                                            message: "Google OAuth is not configured on this server"
                                 });
                      }
                      next();
           },
           passport.authenticate("google", {
                      scope: ["profile", "email"],
                      session: false, // We're using JWT, not sessions
           })
);

// ✅ Google OAuth callback route
router.get(
           "/google/callback",
           (req, res, next) => {
                      if (!isGoogleOAuthConfigured) {
                                 const frontendURL = process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com";
                                 return res.redirect(`${frontendURL}/login?error=oauth_not_configured`);
                      }
                      next();
           },
           passport.authenticate("google", {
                      session: false,
                      failureRedirect: process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com/login?error=oauth_failed",
           }),
           (req, res) => {
                      try {
                                 console.log("✅ Google OAuth callback successful for:", req.user?.username);

                                 if (!req.user) {
                                            console.error("❌ No user object in request");
                                            const frontendURL = process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com";
                                            return res.redirect(`${frontendURL}/login?error=no_user`);
                                 }

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

                                 console.log("✅ JWT created successfully");

                                 // Redirect to frontend with token in URL
                                 const frontendURL = process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com";
                                 console.log(`🔄 Redirecting to: ${frontendURL}/auth/callback?token=${token.substring(0, 20)}...`);
                                 res.redirect(`${frontendURL}/auth/callback?token=${token}`);
                      } catch (error) {
                                 console.error("❌ Error creating JWT after Google auth:", error);
                                 const frontendURL = process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com";
                                 res.redirect(`${frontendURL}/login?error=token_failed`);
                      }
           }
);

export default router;
