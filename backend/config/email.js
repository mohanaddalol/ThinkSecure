import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = () => {
           // Use Gmail SMTP (you can change this to any email service)
           return nodemailer.createTransporter({
                      service: 'gmail',
                      auth: {
                                 user: process.env.EMAIL_USER, // Your email
                                 pass: process.env.EMAIL_PASSWORD // Your email app password
                      }
           });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, username) => {
           try {
                      const transporter = createTransporter();

                      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
                      const resetURL = `${frontendURL}/reset-password?token=${resetToken}`;

                      const mailOptions = {
                                 from: `"ThinkSecure" <${process.env.EMAIL_USER}>`,
                                 to: email,
                                 subject: 'Password Reset Request - ThinkSecure',
                                 html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff8c00, #ff6b00); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">ThinkSecure</h1>
          </div>
          
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: #333;">Password Reset Request</h2>
            
            <p style="color: #555; font-size: 16px;">
              Hi <strong>${username}</strong>,
            </p>
            
            <p style="color: #555; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="background: linear-gradient(135deg, #ff8c00, #ff6b00); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #555; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #007bff; font-size: 14px; word-break: break-all;">
              ${resetURL}
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              ⚠️ This link will expire in <strong>1 hour</strong>.
            </p>
            
            <p style="color: #999; font-size: 14px;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2026 ThinkSecure. All rights reserved.
            </p>
          </div>
        </div>
      `
                      };

                      const info = await transporter.sendMail(mailOptions);
                      console.log('✅ Password reset email sent:', info.messageId);
                      return { success: true, messageId: info.messageId };
           } catch (error) {
                      console.error('❌ Error sending email:', error);
                      return { success: false, error: error.message };
           }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (email, username) => {
           try {
                      const transporter = createTransporter();

                      const mailOptions = {
                                 from: `"ThinkSecure" <${process.env.EMAIL_USER}>`,
                                 to: email,
                                 subject: 'Password Changed Successfully - ThinkSecure',
                                 html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff8c00, #ff6b00); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">ThinkSecure</h1>
          </div>
          
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: #28a745;">✅ Password Changed Successfully</h2>
            
            <p style="color: #555; font-size: 16px;">
              Hi <strong>${username}</strong>,
            </p>
            
            <p style="color: #555; font-size: 16px;">
              Your password has been successfully changed. You can now log in with your new password.
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If you didn't make this change, please contact support immediately.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2026 ThinkSecure. All rights reserved.
            </p>
          </div>
        </div>
      `
                      };

                      const info = await transporter.sendMail(mailOptions);
                      console.log('✅ Confirmation email sent:', info.messageId);
                      return { success: true, messageId: info.messageId };
           } catch (error) {
                      console.error('❌ Error sending confirmation email:', error);
                      return { success: false, error: error.message };
           }
};
