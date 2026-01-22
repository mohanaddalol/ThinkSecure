import React, { useState } from 'react';
import './WebCTF.css';

const WebCTF = () => {
           const [flagInput, setFlagInput] = useState('');
           const [message, setMessage] = useState('');
           const [messageType, setMessageType] = useState('');
           const [showHint, setShowHint] = useState(false);

           const correctFlag = 'THINK{WEB_COOKIE_DECODED_SUCCESS}';
           const encodedCookie = 'eyJ1c2VySWQiOiI2Nzg5IiwidXNlcm5hbWUiOiJndWVzdF91c2VyIiwicm9sZSI6Imd1ZXN0Iiwic2Vzc2lvbiI6ImFlYzk4NzY1NGJkMyIsImZsYWciOiJUSElOS3tXRUJfQ09PS0lFX0RFQ09ERURfU1VDQ0VTU30ifQ==';

           const handleSubmit = (e) => {
                      e.preventDefault();

                      if (flagInput.trim() === correctFlag) {
                                 setMessage('🎉 Congratulations! Flag captured successfully!');
                                 setMessageType('success');
                      } else {
                                 setMessage('❌ Incorrect flag. Keep investigating!');
                                 setMessageType('error');
                      }
           };

           const decodeExample = () => {
                      try {
                                 const decoded = atob(encodedCookie);
                                 alert('Decoded Cookie:\n\n' + JSON.stringify(JSON.parse(decoded), null, 2));
                      } catch (e) {
                                 alert('Error decoding cookie');
                      }
           };

           return (
                      <div className="web-ctf-container">
                                 <div className="web-ctf-header">
                                            <h1>Web CTF Lab - Cookie Analysis</h1>
                                            <p>Investigate suspicious session data and extract the hidden flag</p>
                                 </div>

                                 <div className="ctf-scenario">
                                            <h2>🔍 Investigation Brief</h2>
                                            <div className="scenario-content">
                                                       <p>
                                                                  <strong>Date:</strong> December 9, 2025<br />
                                                                  <strong>Alert Level:</strong> Medium<br />
                                                                  <strong>Case ID:</strong> WEB-2025-091
                                                       </p>
                                                       <p>
                                                                  Our security team detected an unauthorized login attempt on our web application.
                                                                  The attacker left behind a session cookie that appears to be Base64-encoded.
                                                       </p>
                                                       <p>
                                                                  Your mission is to analyze this cookie data, decode it, and extract any hidden information
                                                                  that could help us understand what the attacker was trying to access.
                                                       </p>
                                            </div>
                                 </div>

                                 <div className="evidence-section">
                                            <h2>📋 Evidence - Session Cookie</h2>
                                            <div className="cookie-display">
                                                       <div className="cookie-label">Cookie Name: <span>AUTH_SESSION</span></div>
                                                       <div className="cookie-value">
                                                                  <code>{encodedCookie}</code>
                                                       </div>
                                            </div>
                                            <p className="evidence-note">
                                                       <strong>Note:</strong> This cookie appears to be Base64-encoded. Use online tools or browser console to decode it.
                                            </p>
                                            <button className="decode-helper" onClick={decodeExample}>
                                                       🔓 Decode Cookie (Helper)
                                            </button>
                                 </div>

                                 <div className="hint-section">
                                            <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
                                                       {showHint ? '🔼 Hide Hint' : '💡 Need a Hint?'}
                                            </button>
                                            {showHint && (
                                                       <div className="hint-content">
                                                                  <p><strong>Hint 1:</strong> Base64 is a common encoding method for web data. You can use <code>atob()</code> in the browser console.</p>
                                                                  <p><strong>Hint 2:</strong> Once decoded, the cookie contains JSON data with multiple fields.</p>
                                                                  <p><strong>Hint 3:</strong> Look for a field named "flag" in the decoded JSON object.</p>
                                                                  <p><strong>Hint 4:</strong> The flag format is: THINK&#123;...&#125;</p>
                                                       </div>
                                            )}
                                 </div>

                                 <div className="flag-submission">
                                            <h2>🚩 Submit Flag</h2>
                                            <form onSubmit={handleSubmit}>
                                                       <input
                                                                  type="text"
                                                                  value={flagInput}
                                                                  onChange={(e) => setFlagInput(e.target.value)}
                                                                  placeholder="Enter flag: THINK{...}"
                                                                  className="flag-input"
                                                       />
                                                       <button type="submit" className="submit-flag-btn">
                                                                  Submit Flag
                                                       </button>
                                            </form>
                                            {message && (
                                                       <div className={`flag-message ${messageType}`}>
                                                                  {message}
                                                       </div>
                                            )}
                                 </div>

                                 <div className="learning-section">
                                            <h3>📚 What You Learned</h3>
                                            <ul>
                                                       <li>How to identify Base64-encoded data in web applications</li>
                                                       <li>Techniques for decoding and analyzing session cookies</li>
                                                       <li>Understanding how sensitive data can be exposed in cookies</li>
                                                       <li>Why proper encryption and secure cookie practices are essential</li>
                                            </ul>
                                 </div>
                      </div>
           );
};

export default WebCTF;
