import React, { useRef } from 'react';
import './Certificate.css';

const Certificate = ({ rank, username, totalScore, onClose }) => {
           const certificateRef = useRef(null);

           // Determine medal type and colors based on rank
           const getMedalConfig = () => {
                      switch (rank) {
                                 case 1:
                                            return {
                                                       medal: '🥇',
                                                       color: '#FFD700',
                                                       gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                       title: '1st Place - GOLD CHAMPION',
                                                       border: '#FFD700',
                                                       message: 'Congratulations! You have earned'
                                            };
                                 case 2:
                                            return {
                                                       medal: '🥈',
                                                       color: '#C0C0C0',
                                                       gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
                                                       title: '2nd Place - SILVER MASTER',
                                                       border: '#C0C0C0',
                                                       message: 'Outstanding Achievement! You have earned'
                                            };
                                 case 3:
                                            return {
                                                       medal: '🥉',
                                                       color: '#CD7F32',
                                                       gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
                                                       title: '3rd Place - BRONZE EXPERT',
                                                       border: '#CD7F32',
                                                       message: 'Excellent Performance! You have earned'
                                            };
                                 default:
                                            return {
                                                       medal: '🏆',
                                                       color: '#db570a',
                                                       gradient: 'linear-gradient(135deg, #db570a 0%, #fa7e0b 100%)',
                                                       title: 'Top Performer',
                                                       border: '#db570a',
                                                       message: 'Great Job! You have earned'
                                            };
                      }
           };

           const config = getMedalConfig();

           const handleDownload = () => {
                      // Convert certificate to image for download
                      if (certificateRef.current) {
                                 // Using html2canvas library would be better, but for now we'll use print
                                 window.print();
                      }
           };

           return (
                      <div className="certificate-overlay" onClick={onClose}>
                                 <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                                            <button className="certificate-close" onClick={onClose}>×</button>

                                            <div
                                                       className="certificate-container"
                                                       ref={certificateRef}
                                                       style={{ borderColor: config.border }}
                                            >
                                                       {/* Decorative corners */}
                                                       <div className="certificate-corner corner-top-left" style={{ borderColor: config.color }}></div>
                                                       <div className="certificate-corner corner-top-right" style={{ borderColor: config.color }}></div>
                                                       <div className="certificate-corner corner-bottom-left" style={{ borderColor: config.color }}></div>
                                                       <div className="certificate-corner corner-bottom-right" style={{ borderColor: config.color }}></div>

                                                       {/* Header with logo */}
                                                       <div className="certificate-header">
                                                                  <div className="certificate-logo" style={{ background: config.gradient }}>
                                                                             <span className="logo-text">TS</span>
                                                                  </div>
                                                                  <h1 className="certificate-brand">ThinkSecure</h1>
                                                                  <p className="certificate-subtitle">Cybersecurity Training Platform</p>
                                                       </div>

                                                       {/* Medal */}
                                                       <div className="certificate-medal" style={{ background: config.gradient }}>
                                                                  <span className="medal-icon">{config.medal}</span>
                                                       </div>

                                                       {/* Title */}
                                                       <h2 className="certificate-title" style={{ color: config.color }}>
                                                                  Certificate of Excellence
                                                       </h2>

                                                       {/* Rank Badge */}
                                                       <div className="certificate-rank" style={{
                                                                  background: config.gradient,
                                                                  boxShadow: `0 4px 20px ${config.color}40`
                                                       }}>
                                                                  {config.title}
                                                       </div>

                                                       {/* Main Content */}
                                                       <div className="certificate-content">
                                                                  <p className="certificate-intro">This certification is awarded to</p>

                                                                  <h3 className="certificate-name" style={{ color: config.color }}>
                                                                             {username}
                                                                  </h3>

                                                                  <p className="certificate-message">
                                                                             {config.message}
                                                                  </p>

                                                                  <div className="certificate-score" style={{
                                                                             background: config.gradient,
                                                                             boxShadow: `0 4px 15px ${config.color}30`
                                                                  }}>
                                                                             <span className="score-number">{totalScore}</span>
                                                                             <span className="score-label">Total Points</span>
                                                                  </div>

                                                                  <p className="certificate-achievement">
                                                                             has demonstrated exceptional skills and dedication in mastering
                                                                             cybersecurity challenges on the ThinkSecure platform and achieved
                                                                             a position among the top 3 global learners.
                                                                  </p>
                                                       </div>

                                                       {/* Footer */}
                                                       <div className="certificate-footer">
                                                                  <div className="certificate-date">
                                                                             <p className="date-label">Date of Achievement</p>
                                                                             <p className="date-value">{new Date().toLocaleDateString('en-US', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                             })}</p>
                                                                  </div>

                                                                  <div className="certificate-signature">
                                                                             <div className="signature-line" style={{ borderColor: config.color }}></div>
                                                                             <p className="signature-label">Mohanad</p>
                                                                             <p className="signature-label">Rafi</p>
                                                                  </div>
                                                       </div>

                                                       {/* Decorative elements */}
                                                       <div className="certificate-pattern" style={{ opacity: 0.05 }}>
                                                                  <div className="pattern-shield">🛡️</div>
                                                                  <div className="pattern-lock">🔒</div>
                                                                  <div className="pattern-key">🔑</div>
                                                       </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="certificate-actions">
                                                       <button
                                                                  className="certificate-download"
                                                                  onClick={handleDownload}
                                                                  style={{ background: config.gradient }}
                                                       >
                                                                  📥 Download Certificate
                                                       </button>
                                                       <button className="certificate-close-btn" onClick={onClose}>
                                                                  Close
                                                       </button>
                                            </div>
                                 </div>
                      </div>
           );
};

export default Certificate;
