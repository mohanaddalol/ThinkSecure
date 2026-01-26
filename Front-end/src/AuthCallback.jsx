import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ✅ This component handles the OAuth callback from Google
// Google redirects here with the JWT token after successful authentication
export default function AuthCallback({ onAuth }) {
           const navigate = useNavigate();
           const [searchParams] = useSearchParams();
           const hasProcessed = useRef(false); // Prevent multiple executions

           useEffect(() => {
                      // Prevent running multiple times
                      if (hasProcessed.current) {
                                 console.log('⏭️ Already processed, skipping...');
                                 return;
                      }

                      const token = searchParams.get('token');
                      const error = searchParams.get('error');

                      console.log('🔍 AuthCallback - token:', token ? 'exists' : 'missing', 'error:', error);

                      if (error) {
                                 console.error('❌ OAuth error:', error);
                                 alert('Authentication failed: ' + error);
                                 hasProcessed.current = true;
                                 navigate('/', { replace: true });
                                 return;
                      }

                      if (token) {
                                 hasProcessed.current = true; // Mark as processed immediately
                                 console.log('✅ Received OAuth token, logging in...');

                                 // Decode JWT to get user info (without verification - backend already verified)
                                 try {
                                            const payload = JSON.parse(atob(token.split('.')[1]));
                                            console.log('✅ Decoded payload:', payload);

                                            const user = {
                                                       id: payload.id,
                                                       username: payload.username,
                                                       email: payload.email,
                                                       provider: payload.provider || 'google',
                                            };

                                            // Store token and user info
                                            localStorage.setItem('token', token);
                                            localStorage.setItem('user', JSON.stringify(user));

                                            console.log('✅ User stored in localStorage:', user);

                                            // Call parent auth handler
                                            if (onAuth) {
                                                       onAuth({ token, user });
                                            }

                                            // Redirect to home
                                            setTimeout(() => navigate('/', { replace: true }), 100);
                                 } catch (err) {
                                            console.error('❌ Error parsing token:', err);
                                            alert('Authentication failed. Error: ' + err.message);
                                            setTimeout(() => navigate('/', { replace: true }), 100);
                                 }
                      } else {
                                 console.log('⚠️ No token in callback URL');
                                 alert('No authentication token received.');
                                 hasProcessed.current = true;
                                 setTimeout(() => navigate('/', { replace: true }), 100);
                      }
                      // eslint-disable-next-line react-hooks/exhaustive-deps
           }, []); // Run only once on mount

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
