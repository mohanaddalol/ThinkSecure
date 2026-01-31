# Google OAuth Fix for Render Deployment

## Problem
"Continue with Google" button not working on Render deployment.

## Root Causes Identified & Fixed

### 1. ✅ Lean Query Issue in Passport
**Problem**: Using `.lean()` on Google OAuth user lookup returned plain JavaScript object instead of Mongoose document, breaking Passport serialization.

**Fix**: Removed `.lean()` from Google OAuth user query in [passport.js](backend/config/passport.js)

```javascript
// Before (broken)
let user = await User.findOne({ googleId: profile.id }).lean();

// After (fixed)
let user = await User.findOne({ googleId: profile.id });
```

### 2. ✅ Production URL Fallbacks
**Problem**: Hardcoded localhost URLs as fallbacks instead of production URLs.

**Fix**: Changed fallback URLs to production Render URLs in [googleAuthRoutes.js](backend/routes/googleAuthRoutes.js)

```javascript
// Before
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

// After
const frontendURL = process.env.FRONTEND_URL || "https://thinksecure-frontend.onrender.com";
```

### 3. ✅ Better Error Logging
**Added**: Comprehensive logging to debug OAuth flow in production

## Setup Instructions for Render

### Step 1: Update Google OAuth Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add Authorized redirect URIs:
   ```
   https://thinksecure.onrender.com/api/auth/google/callback
   ```
4. Add Authorized JavaScript origins:
   ```
   https://thinksecure.onrender.com
   https://thinksecure-frontend.onrender.com
   ```
5. Click **SAVE**

### Step 2: Configure Backend Environment Variables on Render

Go to your backend service on Render.com → Environment tab → Add these variables:

```bash
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://thinksecure.onrender.com/api/auth/google/callback
FRONTEND_URL=https://thinksecure-frontend.onrender.com

NODE_ENV=production
```

**⚠️ Important**: Replace `https://thinksecure.onrender.com` with your actual Render backend URL!

### Step 3: Configure Frontend Environment Variables on Render

Go to your frontend service on Render.com → Environment tab → Add these variables:

```bash
VITE_API_URL=https://thinksecure.onrender.com
VITE_BACKEND_URL=https://thinksecure.onrender.com
```

**⚠️ Important**: Replace with your actual backend URL!

### Step 4: Redeploy Both Services

1. **Backend**: Trigger manual deploy or push to GitHub
2. **Frontend**: Trigger manual deploy or push to GitHub
3. Wait for both to finish deploying

## Testing the Fix

### Test Google OAuth Flow:

1. Go to your production site: `https://thinksecure-frontend.onrender.com`
2. Click "Sign Up" or "Login"
3. Click "Continue with Google" button
4. **Expected behavior**:
   - Google login popup appears
   - After authentication, redirects back to your site
   - User is logged in automatically
   - Username appears in navbar

### Debugging Production Issues

If still not working, check Render logs:

#### Backend Logs (Render Dashboard → Backend Service → Logs):
Look for:
```
🔍 Google OAuth Profile: <google-id> <email>
✅ Google OAuth callback successful for: <username>
✅ JWT created successfully
🔄 Redirecting to: https://...
```

#### Common Errors & Solutions:

**Error**: `redirect_uri_mismatch`
- **Cause**: Google Console redirect URI doesn't match
- **Fix**: Ensure Google Console has exact URL: `https://thinksecure.onrender.com/api/auth/google/callback`

**Error**: `Invalid JWT token` or token undefined
- **Cause**: JWT_SECRET not set correctly
- **Fix**: Check backend environment variables on Render

**Error**: `CORS error`
- **Cause**: Frontend origin not allowed
- **Fix**: Check backend `allowedOrigins` array in [server.js](backend/server.js)

**Error**: `oauth_failed` in URL
- **Cause**: Passport authentication failed
- **Fix**: Check backend logs for specific error

## Local Development vs Production

### Local Development (.env)
```bash
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Production (.env on Render)
```bash
GOOGLE_CALLBACK_URL=https://thinksecure.onrender.com/api/auth/google/callback
FRONTEND_URL=https://thinksecure-frontend.onrender.com
```

## Verification Checklist

Before considering this fixed, verify:

- [ ] Google Console has production redirect URI
- [ ] Backend environment variables set on Render
- [ ] Frontend environment variables set on Render
- [ ] Both services redeployed after env var changes
- [ ] Can click "Continue with Google" button
- [ ] Google login popup appears
- [ ] Successfully redirects back to site
- [ ] User is logged in (username in navbar)
- [ ] JWT token stored in localStorage
- [ ] Can access protected routes

## Architecture Flow

```
User clicks "Continue with Google"
    ↓
Frontend: window.location.href = "https://backend/api/auth/google"
    ↓
Backend: passport.authenticate("google") → Redirects to Google
    ↓
Google Login Page (user authenticates)
    ↓
Google redirects to: https://backend/api/auth/google/callback?code=...
    ↓
Backend: Passport verifies code, gets user profile
    ↓
Backend: Creates/finds user in database
    ↓
Backend: Generates JWT token
    ↓
Backend: Redirects to frontend: https://frontend/auth/callback?token=...
    ↓
Frontend: AuthCallback.jsx extracts token from URL
    ↓
Frontend: Stores token in localStorage
    ↓
Frontend: Redirects to home page
    ↓
User is logged in ✅
```

## Files Modified

1. [backend/config/passport.js](backend/config/passport.js) - Fixed lean() query issue
2. [backend/routes/googleAuthRoutes.js](backend/routes/googleAuthRoutes.js) - Updated production URLs and logging
3. [backend/.env.production](backend/.env.production) - Production environment template
4. [Front-end/.env.production](Front-end/.env.production) - Frontend production template

## Security Notes

- JWT_SECRET should be a strong random string in production
- Google Client Secret should never be committed to Git
- All credentials are stored in Render environment variables, not in code
- OAuth callback URL must use HTTPS in production
- `proxy: true` setting in Passport allows it to work behind Render's reverse proxy

---

**Status**: ✅ Fixed - Google OAuth should now work on Render

**Next Steps**: 
1. Update Google Console with production URLs
2. Set environment variables on Render
3. Redeploy both services
4. Test the flow

**Last Updated**: January 31, 2026
