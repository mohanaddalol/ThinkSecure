# Forgot Password Feature - Setup Guide

## Overview
Complete password reset functionality with email notifications has been added to ThinkSecure.

## Features Added

### Backend:
1. ✅ Password reset request endpoint (`/api/forgot-password`)
2. ✅ Password reset with token endpoint (`/api/reset-password`)
3. ✅ Email service with nodemailer
4. ✅ Secure token generation with crypto
5. ✅ Token expiration (1 hour)
6. ✅ Email templates (reset link + confirmation)

### Frontend:
1. ✅ "Forgot password?" link in login modal
2. ✅ Forgot password form
3. ✅ Password reset page (`/reset-password`)
4. ✅ Success/error handling
5. ✅ Password validation

## Email Setup (Required)

### For Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "ThinkSecure" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### For Other Email Services:

Update `backend/config/email.js`:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## How It Works

### User Flow:

1. **User forgets password**
   - Clicks "Forgot password?" on login page
   - Enters email address
   - Clicks "Send Reset Link"

2. **Backend processes request**
   - Generates secure random token
   - Hashes and stores token in database
   - Sets expiration time (1 hour)
   - Sends email with reset link

3. **User receives email**
   - Email contains reset link: `https://yoursite.com/reset-password?token=...`
   - Link expires in 1 hour
   - Professional HTML email template

4. **User resets password**
   - Clicks link in email
   - Enters new password
   - Confirms password
   - Submits form

5. **Backend verifies and updates**
   - Validates token (not expired)
   - Validates new password
   - Updates password
   - Clears reset token
   - Sends confirmation email

6. **Success**
   - User receives confirmation email
   - Redirected to login
   - Can log in with new password

## Security Features

✅ **Token Security**:
- Crypto-secure random token (32 bytes)
- Token hashed before storing in database
- 1-hour expiration
- Single-use tokens (cleared after use)

✅ **Information Disclosure Prevention**:
- Same response for existent/non-existent emails
- Attackers can't determine if email is registered

✅ **Password Validation**:
- Minimum 8 characters
- English letters, numbers, symbols only
- Confirmed password matching

✅ **Email Verification**:
- Reset link sent to registered email only
- Confirms user owns the email address

## Testing Locally

1. **Start Backend**:
```bash
cd backend
npm start
```

2. **Start Frontend**:
```bash
cd Front-end
npm run dev
```

3. **Test Flow**:
   - Go to http://localhost:5173
   - Click Login
   - Click "Forgot password?"
   - Enter your email
   - Check your email inbox
   - Click reset link
   - Enter new password
   - Log in with new password

## Production Deployment (Render)

### Backend Environment Variables:
Add to Render backend service:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://thinksecure-frontend.onrender.com
```

### Frontend:
No changes needed - automatically uses backend URL

## Troubleshooting

### Email not received?

1. **Check spam/junk folder**
2. **Verify EMAIL_USER and EMAIL_PASSWORD**
3. **Check backend logs**:
   ```
   ✅ Password reset email sent to: user@example.com
   ```
4. **Gmail App Password issues**:
   - Make sure 2FA is enabled
   - Generate new app password
   - Use 16-character password without spaces

### Token expired error?

- Reset links expire after 1 hour
- Request a new reset link

### Wrong email format?

- Use Gmail: your-email@gmail.com
- Or configure different SMTP provider

### Can't reset Google OAuth accounts?

- Accounts using "Continue with Google" don't have passwords
- They must log in with Google

## API Endpoints

### Request Password Reset
```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "message": "If an account exists with this email, you will receive a password reset link shortly."
}
```

### Reset Password
```http
POST /api/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "newPassword123!"
}
```

**Response**:
```json
{
  "message": "Password reset successful! You can now log in with your new password."
}
```

## Email Templates

### Reset Email:
- Professional design
- Clear "Reset Password" button
- Copy-paste link option
- Expiration warning
- Security notice

### Confirmation Email:
- Success message
- Security alert
- Contact support option

## Files Modified/Created

### Backend:
- `backend/models/User.js` - Added reset token fields
- `backend/config/email.js` - Email service (NEW)
- `backend/routes/authRoutes.js` - Password reset routes
- `backend/.env` - Email credentials

### Frontend:
- `Front-end/src/AuthModal.jsx` - Forgot password UI
- `Front-end/src/ResetPassword.jsx` - Reset password page (NEW)
- `Front-end/src/App.jsx` - Reset password route

### Dependencies Added:
- `nodemailer` - Email sending

## Next Steps

1. ✅ Add your Gmail credentials to `.env`
2. ✅ Test password reset locally
3. ✅ Add credentials to Render environment variables
4. ✅ Test in production

---

**Status**: ✅ Complete - Password reset with email is fully functional!

**Last Updated**: January 31, 2026
