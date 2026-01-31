import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";

// ✅ Ensure environment variables are loaded
dotenv.config();

// ✅ Configure Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
           passport.use(
                      new GoogleStrategy(
                                 {
                                            clientID: process.env.GOOGLE_CLIENT_ID,
                                            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                                            callbackURL: process.env.GOOGLE_CALLBACK_URL,
                                            proxy: true, // Important for Render/Heroku deployments behind proxy
                                 },
                                 async (accessToken, refreshToken, profile, done) => {
                                            try {
                                                       console.log("🔍 Google OAuth Profile:", profile.id, profile.emails[0].value);

                                                       // Check if user already exists with this Google ID
                                                       let user = await User.findOne({ googleId: profile.id });

                                                       if (user) {
                                                                  console.log("✅ Existing Google user found:", user.username);
                                                                  return done(null, user);
                                                       }

                                                       // Check if user exists with this email (link accounts)
                                                       user = await User.findOne({ email: profile.emails[0].value });

                                                       if (user) {
                                                                  // Link Google account to existing email/password account
                                                                  console.log("🔗 Linking Google to existing account:", user.username);
                                                                  user.googleId = profile.id;
                                                                  user.provider = "google";
                                                                  user.avatar = profile.photos[0]?.value;
                                                                  await user.save();
                                                                  return done(null, user);
                                                       }

                                                       // Create new user from Google profile
                                                       console.log("➕ Creating new Google user");

                                                       // Generate unique username from email or display name
                                                       let baseUsername = profile.displayName?.replace(/\s+/g, "_") || profile.emails[0].value.split("@")[0];
                                                       let username = baseUsername;
                                                       let counter = 1;

                                                       // Ensure username is unique
                                                       while (await User.findOne({ username })) {
                                                                  username = `${baseUsername}_${counter}`;
                                                                  counter++;
                                                       }

                                                       user = await User.create({
                                                                  username,
                                                                  email: profile.emails[0].value,
                                                                  googleId: profile.id,
                                                                  provider: "google",
                                                                  avatar: profile.photos[0]?.value,
                                                                  password: undefined, // No password for Google OAuth users
                                                       });

                                                       // Create leaderboard entry for new Google user (non-blocking)
                                                       setImmediate(() => {
                                                                  Leaderboard.create({
                                                                             userId: user._id,
                                                                             username: user.username,
                                                                             totalScore: 0,
                                                                             solvedChallenges: []
                                                                  }).catch(err => console.error('Leaderboard creation error:', err));
                                                       });

                                                       console.log("✅ New Google user created:", user.username);
                                                       return done(null, user);
                                            } catch (error) {
                                                       console.error("❌ Google OAuth error:", error);
                                                       return done(error, null);
                                            }
                                 }
                      )
           );
} else {
           console.warn('⚠️ Google OAuth credentials not configured - Google login will be disabled');
}

// Serialize user to session (not used with JWT but required by Passport)
passport.serializeUser((user, done) => {
           done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
           try {
                      const user = await User.findById(id);
                      done(null, user);
           } catch (error) {
                      done(error, null);
           }
});

export default passport;
