# 🔑 Environment Variables Quick Reference

## Backend Environment Variables

Add these to your `/backend/.env` file (local) and Render dashboard (production):

```env
# ==========================================
# EXISTING VARIABLES (Keep these)
# ==========================================
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_minimum_32_characters_long
PORT=5000
NODE_ENV=development  # or "production" on Render

# ==========================================
# NEW GOOGLE OAUTH VARIABLES (Required)
# ==========================================

# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here

# LOCAL DEVELOPMENT:
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173

# PRODUCTION (Render) - Comment out local URLs above and use these:
# GOOGLE_CALLBACK_URL=https://thinksecure.onrender.com/api/auth/google/callback
# FRONTEND_URL=https://thinksecure-frontend.onrender.com
```

---

## Frontend Environment Variables

Add these to your `/Front-end/.env` file (local) and Render dashboard (production):

```env
# LOCAL DEVELOPMENT:
VITE_BACKEND_URL=http://localhost:5000

# PRODUCTION (Render) - Use this instead:
# VITE_BACKEND_URL=https://thinksecure.onrender.com
```

---

## 🚨 Render Production Setup (IMPORTANT)

### Backend Service on Render

Navigate to: **Dashboard → Backend Service → Environment**

Add these **NEW** variables:
```
GOOGLE_CLIENT_ID = [your_google_client_id].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-[your_secret]
GOOGLE_CALLBACK_URL = https://thinksecure.onrender.com/api/auth/google/callback
FRONTEND_URL = https://thinksecure-frontend.onrender.com
```

### Frontend Service on Render

Navigate to: **Dashboard → Frontend Service → Environment**

Add this **NEW** variable:
```
VITE_BACKEND_URL = https://thinksecure.onrender.com
```

---

## 📝 Google Cloud Console Configuration

### Authorized JavaScript origins:
```
http://localhost:5173
http://localhost:5000
https://thinksecure.onrender.com
https://thinksecure-frontend.onrender.com
```

### Authorized redirect URIs:
```
http://localhost:5000/api/auth/google/callback
https://thinksecure.onrender.com/api/auth/google/callback
```

---

## ✅ Verification Checklist

**Local Development:**
- [ ] Backend `.env` has GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [ ] Backend `.env` has GOOGLE_CALLBACK_URL pointing to localhost:5000
- [ ] Backend `.env` has FRONTEND_URL pointing to localhost:5173
- [ ] Frontend `.env` has VITE_BACKEND_URL pointing to localhost:5000
- [ ] `npm install passport passport-google-oauth20` executed in `/backend`
- [ ] Both servers running (`npm run dev`)
- [ ] "Continue with Google" button appears in auth modal
- [ ] Clicking button redirects to Google login

**Production (Render):**
- [ ] Backend Render service has all 4 Google env variables set
- [ ] Frontend Render service has VITE_BACKEND_URL set
- [ ] Google Cloud Console has production redirect URI added
- [ ] Both services redeployed after env variable changes
- [ ] "Continue with Google" works on live site
- [ ] After Google login, user is redirected back and logged in

---

## 🔗 Quick Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Render Dashboard](https://dashboard.render.com/)
- [Full Setup Guide](./GOOGLE_OAUTH_SETUP.md)

---

## 💡 Common Issues

**"redirect_uri_mismatch" error:**
→ Check Google Console redirect URIs match exactly (http vs https, trailing slashes)

**"Cannot find module 'passport'":**
→ Run `npm install passport passport-google-oauth20` in `/backend`

**Google button doesn't redirect:**
→ Check VITE_BACKEND_URL is set correctly in frontend .env

**OAuth works locally but not on Render:**
→ Verify production environment variables are set on both Render services
→ Ensure Google Console has production redirect URI added
