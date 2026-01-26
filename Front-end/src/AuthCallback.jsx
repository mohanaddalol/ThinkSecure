import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ✅ This component handles the OAuth callback from Google
// Google redirects here with the JWT token after successful authentication
export default function AuthCallback({ onAuth }) {
           const navigate = useNavigate();
           const [searchParams] = useSearchParams();

           useEffect(() => {
                      const token = searchParams.get('token');
                      const error = searchParams.get('error');

                      if (error) {
                                 console.error('❌ OAuth error:', error);
                                 alert('Authentication failed. Please try again.');
                                 navigate('/');
                                 return;
                      }

                      if (token) {
                                 console.log('✅ Received OAuth token, logging in...');

                                 // Decode JWT to get user info (without verification - backend already verified)
                                 try {
                                            const payload = JSON.parse(atob(token.split('.')[1]));
                                            const user = {
                                                       id: payload.id,
                                                       username: payload.username,
                                                       email: payload.email,
                                                       provider: payload.provider,
                                            };

                                            // Store token and user info
                                            localStorage.setItem('token', token);
                                            localStorage.setItem('user', JSON.stringify(user));

                                            // Call parent auth handler
                                            onAuth({ token, user });

                                            // Redirect to home
                                            navigate('/', { replace: true });
                                 } catch (err) {
                                            console.error('❌ Error parsing token:', err);
                                            alert('Authentication failed. Please try again.');
                                            navigate('/');
                                 }
                      } else {
                                 console.log('⚠️ No token or error in callback');
                                 navigate('/');
                      }
           }, [searchParams, navigate, onAuth]);

           return (
                      <div style={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 height: '100vh',
                                 background: '#0a0e27',
                                 color: '#fff',
                      }}>
                                 <div style={{ textAlign: 'center' }}>
                                            <h2>🔐 Authenticating with Google...</h2>
                                            <p>Please wait while we log you in</p>
                                 </div>
                      </div>
           );
}
