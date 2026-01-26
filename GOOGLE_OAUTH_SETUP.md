# 🔐 Google OAuth 2.0 Integration Guide - ThinkSecure

## 📋 Overview
This guide provides complete setup instructions for Google OAuth authentication in your MERN application.

---

## 🛠️ Step 1: Google Cloud Console Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Name: `ThinkSecure` → Click **"Create"**

### 2. Enable Google+ API
1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### 3. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure **OAuth consent screen**:
   - User Type: **External**
   - App name: `ThinkSecure`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `userinfo.email` and `userinfo.profile`
   - Save and Continue

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `ThinkSecure Web Client`

### 4. Configure Authorized URIs

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:5000
https://thinksecure.onrender.com
https://thinksecure-frontend.onrender.com
```

**Authorized redirect URIs:**
```
http://localhost:5000/api/auth/google/callback
https://thinksecure.onrender.com/api/auth/google/callback
```

5. Click **"Create"**
6. **IMPORTANT:** Copy your **Client ID** and **Client Secret**

---

## 🔧 Step 2: Environment Variables

### Backend (.env file in `/backend`)

Create or update your `.env` file:

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OAuth Callback URL
# For LOCAL development:
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# For PRODUCTION (Render):
# GOOGLE_CALLBACK_URL=https://thinksecure.onrender.com/api/auth/google/callback

# Frontend URL (for redirects after OAuth)
# For LOCAL development:
FRONTEND_URL=http://localhost:5173

# For PRODUCTION (Render):
# FRONTEND_URL=https://thinksecure-frontend.onrender.com

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (.env file in `/Front-end`)

Create `.env` in your frontend root:

```env
# Backend API URL
# For LOCAL development:
VITE_BACKEND_URL=http://localhost:5000

# For PRODUCTION (Render):
# VITE_BACKEND_URL=https://thinksecure.onrender.com
```

---

## 📦 Step 3: Install Required Packages

### Backend Dependencies

```bash
cd backend
npm install passport passport-google-oauth20
```

**Packages installed:**
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth 2.0 strategy

---

## 🚀 Step 4: Render Deployment Setup

### Backend Environment Variables on Render

1. Go to your backend service on Render
2. Navigate to **Environment** tab
3. Add these variables:

```
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://thinksecure.onrender.com/api/auth/google/callback
FRONTEND_URL=https://thinksecure-frontend.onrender.com
```

4. Keep existing variables (MONGO_URI, JWT_SECRET, etc.)
5. Click **"Save Changes"** → Service will auto-redeploy

### Frontend Environment Variables on Render

1. Go to your frontend service on Render
2. Navigate to **Environment** tab
3. Add:

```
VITE_BACKEND_URL=https://thinksecure.onrender.com
```

4. Click **"Save Changes"** → Service will auto-redeploy

---

## 🔄 Step 5: Testing OAuth Flow

### Local Testing (Development)

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend:**
```bash
cd Front-end
npm run dev
```

3. **Test Google Login:**
   - Open `http://localhost:5173`
   - Click **"Continue with Google"**
   - Should redirect to Google login
   - After authentication, redirects back to `http://localhost:5173/auth/callback?token=...`
   - User logged in automatically

### Production Testing (Render)

1. Push code to GitHub (triggers auto-deploy)
2. Wait for both services to deploy
3. Visit `https://thinksecure-frontend.onrender.com`
4. Click **"Continue with Google"**
5. Authenticate with Google
6. Redirects to `https://thinksecure-frontend.onrender.com/auth/callback?token=...`
7. User logged in

---

## 🔐 How It Works

### Authentication Flow

```
1. User clicks "Continue with Google"
   ↓
2. Frontend redirects to: https://thinksecure.onrender.com/api/auth/google
   ↓
3. Backend redirects to Google OAuth consent screen
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to: https://thinksecure.onrender.com/api/auth/google/callback
   ↓
6. Backend receives Google profile data
   ↓
7. Backend creates/updates user in MongoDB
   ↓
8. Backend generates JWT token
   ↓
9. Backend redirects to: https://thinksecure-frontend.onrender.com/auth/callback?token=JWT_HERE
   ↓
10. Frontend AuthCallback component extracts token
   ↓
11. Frontend stores token in localStorage
   ↓
12. User is logged in and redirected to home
```

---

## 📁 Files Created/Modified

### Backend Files
- ✅ `/backend/models/User.js` - Added googleId, provider, avatar fields
- ✅ `/backend/config/passport.js` - Google OAuth strategy configuration
- ✅ `/backend/routes/googleAuthRoutes.js` - OAuth routes (/google, /google/callback)
- ✅ `/backend/server.js` - Integrated passport middleware and routes

### Frontend Files
- ✅ `/Front-end/src/AuthModal.jsx` - Added "Continue with Google" button
- ✅ `/Front-end/src/AuthCallback.jsx` - OAuth callback handler component
- ✅ `/Front-end/src/App.jsx` - Added /auth/callback route

---

## 🧪 Testing Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth credentials configured with correct redirect URIs
- [ ] Backend .env has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- [ ] Frontend .env has VITE_BACKEND_URL
- [ ] Packages installed: `passport`, `passport-google-oauth20`
- [ ] Local testing: Google login works
- [ ] Render environment variables set
- [ ] Production testing: Google login works on live site
- [ ] Existing email/password login still works
- [ ] New Google users create leaderboard entries
- [ ] Returning Google users login correctly

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** Check that your redirect URIs in Google Cloud Console exactly match your backend URL:
- Local: `http://localhost:5000/api/auth/google/callback`
- Production: `https://thinksecure.onrender.com/api/auth/google/callback`

### Error: "Access blocked: This app's request is invalid"
**Solution:** Make sure Google+ API is enabled in your Google Cloud project.

### Error: "Cannot read properties of undefined (reading 'emails')"
**Solution:** In Google OAuth consent screen, ensure email scope is added.

### User created but no leaderboard entry
**Solution:** Check that leaderboard creation code is executed in `/backend/config/passport.js`

### Google login button not showing
**Solution:** Check that VITE_BACKEND_URL is set in frontend .env and accessible.

---

## 🔒 Security Notes

- ✅ JWT tokens expire after 7 days
- ✅ Passwords are NOT required for Google OAuth users
- ✅ Google users can link to existing email accounts
- ✅ OAuth flow uses `session: false` (JWT-based, not sessions)
- ✅ All credentials stored in environment variables (never in code)
- ✅ CORS properly configured for frontend-backend communication

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend server logs
3. Verify all environment variables are set
4. Ensure Google Cloud Console redirect URIs match exactly
5. Test locally before deploying to production

---

**🎉 Setup Complete! Users can now authenticate with both:**
- Traditional email/password
- Google OAuth 2.0 ("Continue with Google")
