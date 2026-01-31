import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL, apiPost } from './api';

const validatePassword = (password) => {
           if (password.length < 8) {
                      return { valid: false, message: "Password must be at least 8 characters long" };
           }
           const asciiRegex = /^[\x20-\x7E]+$/;
           if (!asciiRegex.test(password)) {
                      return { valid: false, message: "Password must contain only English letters, numbers, and symbols" };
           }
           return { valid: true };
};

export default function ResetPassword() {
           const [searchParams] = useSearchParams();
           const navigate = useNavigate();
           const [password, setPassword] = useState('');
           const [confirmPassword, setConfirmPassword] = useState('');
           const [loading, setLoading] = useState(false);
           const [error, setError] = useState('');
           const [success, setSuccess] = useState(false);
           const token = searchParams.get('token');

           useEffect(() => {
                      if (!token) {
                                 setError('Invalid or missing reset token');
                      }
           }, [token]);

           const handleSubmit = async (e) => {
                      e.preventDefault();
                      setError('');

                      if (!token) {
                                 setError('Invalid or missing reset token');
                                 return;
                      }

                      if (!password || !confirmPassword) {
                                 setError('Please fill in all fields');
                                 return;
                      }

                      if (password !== confirmPassword) {
                                 setError('Passwords do not match');
                                 return;
                      }

                      const passwordCheck = validatePassword(password);
                      if (!passwordCheck.valid) {
                                 setError(passwordCheck.message);
                                 return;
                      }

                      setLoading(true);
                      try {
                                 const data = await apiPost('/api/reset-password', { token, password });
                                 setSuccess(true);
                                 setTimeout(() => {
                                            navigate('/');
                                 }, 3000);
                      } catch (err) {
                                 setError(err.message || 'Failed to reset password');
                      } finally {
                                 setLoading(false);
                      }
           };

           return (
                      <div style={{
                                 minHeight: '100vh',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 background: '#0a0e27',
                                 padding: '20px'
                      }}>
                                 <div style={{
                                            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95), rgba(26, 30, 55, 0.95))',
                                            padding: '40px',
                                            borderRadius: '20px',
                                            width: '100%',
                                            maxWidth: '450px',
                                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                 }}>
                                            <h2 style={{
                                                       marginBottom: '25px',
                                                       background: 'linear-gradient(135deg, #00f2ff, #7b2cbf)',
                                                       backgroundClip: 'text',
                                                       WebkitBackgroundClip: 'text',
                                                       WebkitTextFillColor: 'transparent',
                                                       fontSize: '28px',
                                                       textAlign: 'center'
                                            }}>
                                                       Reset Your Password
                                            </h2>

                                            {success ? (
                                                       <div style={{
                                                                  color: '#28a745',
                                                                  background: '#d4edda',
                                                                  border: '1px solid #c3e6cb',
                                                                  padding: '20px',
                                                                  borderRadius: '10px',
                                                                  textAlign: 'center',
                                                                  marginBottom: '20px'
                                                       }}>
                                                                  <h3 style={{ color: '#28a745', marginBottom: '10px' }}>✅ Password Reset Successful!</h3>
                                                                  <p style={{ color: '#155724', marginBottom: 0 }}>
                                                                             You can now log in with your new password. Redirecting...
                                                                  </p>
                                                       </div>
                                            ) : (
                                                       <form onSubmit={handleSubmit}>
                                                                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px', fontSize: '14px' }}>
                                                                             Enter your new password below. Make sure it's at least 8 characters long.
                                                                  </p>

                                                                  <label style={{
                                                                             display: 'block',
                                                                             marginBottom: '8px',
                                                                             color: 'rgba(255, 255, 255, 0.9)',
                                                                             fontSize: '14px',
                                                                             fontWeight: '500'
                                                                  }}>
                                                                             New Password
                                                                  </label>
                                                                  <input
                                                                             type="password"
                                                                             placeholder="Enter new password"
                                                                             value={password}
                                                                             onChange={(e) => setPassword(e.target.value)}
                                                                             required
                                                                             style={{
                                                                                        width: '100%',
                                                                                        padding: '12px 16px',
                                                                                        marginBottom: '20px',
                                                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                                        borderRadius: '10px',
                                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                                        color: '#ffffff',
                                                                                        fontSize: '15px',
                                                                                        outline: 'none'
                                                                             }}
                                                                  />

                                                                  <label style={{
                                                                             display: 'block',
                                                                             marginBottom: '8px',
                                                                             color: 'rgba(255, 255, 255, 0.9)',
                                                                             fontSize: '14px',
                                                                             fontWeight: '500'
                                                                  }}>
                                                                             Confirm Password
                                                                  </label>
                                                                  <input
                                                                             type="password"
                                                                             placeholder="Confirm new password"
                                                                             value={confirmPassword}
                                                                             onChange={(e) => setConfirmPassword(e.target.value)}
                                                                             required
                                                                             style={{
                                                                                        width: '100%',
                                                                                        padding: '12px 16px',
                                                                                        marginBottom: '20px',
                                                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                                        borderRadius: '10px',
                                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                                        color: '#ffffff',
                                                                                        fontSize: '15px',
                                                                                        outline: 'none'
                                                                             }}
                                                                  />

                                                                  {error && (
                                                                             <div style={{
                                                                                        color: '#dc3545',
                                                                                        background: '#f8d7da',
                                                                                        border: '1px solid #f5c6cb',
                                                                                        padding: '12px',
                                                                                        borderRadius: '6px',
                                                                                        marginBottom: '15px',
                                                                                        fontSize: '14px'
                                                                             }}>
                                                                                        ⚠️ {error}
                                                                             </div>
                                                                  )}

                                                                  <button
                                                                             type="submit"
                                                                             disabled={loading}
                                                                             style={{
                                                                                        width: '100%',
                                                                                        background: 'linear-gradient(135deg, #00f2ff, #7b2cbf)',
                                                                                        color: '#ffffff',
                                                                                        border: 'none',
                                                                                        padding: '14px 24px',
                                                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                                                        borderRadius: '10px',
                                                                                        fontSize: '16px',
                                                                                        fontWeight: '600',
                                                                                        boxShadow: '0 4px 15px rgba(0, 242, 255, 0.3)',
                                                                                        opacity: loading ? 0.7 : 1
                                                                             }}
                                                                  >
                                                                             {loading ? 'Resetting Password...' : 'Reset Password'}
                                                                  </button>

                                                                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                                                             <button
                                                                                        type="button"
                                                                                        onClick={() => navigate('/')}
                                                                                        style={{
                                                                                                   background: 'none',
                                                                                                   border: 'none',
                                                                                                   color: '#00f2ff',
                                                                                                   fontSize: '14px',
                                                                                                   cursor: 'pointer',
                                                                                                   textDecoration: 'underline'
                                                                                        }}
                                                                             >
                                                                                        Back to Home
                                                                             </button>
                                                                  </div>
                                                       </form>
                                            )}
                                 </div>
                      </div>
           );
}
