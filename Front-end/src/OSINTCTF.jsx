import React, { useState } from 'react';
import './OSINTCTF.css';

const challenges = [
           {
                      id: 2,
                      title: 'Twitter Username Investigation',
                      difficulty: 'Easy',
                      flag: 'THINK{TWITTER_OSINT_PRO}',
                      description: 'Investigate a suspicious Twitter account that has been spreading misinformation about cybersecurity.',
                      objective: 'Find the hidden flag in the user\'s bio or profile information',
                      targetProfile: '@sec_researcher_99',
                      lastActivity: 'Tweet posted 12 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Low',
                      caseType: 'Social Media Intelligence',
                      hint1: 'Check the user\'s bio, location, and website URL. Sometimes information is encoded in profile fields.',
                      hint2: 'The flag is hidden in the profile description. Look for base64 encoded text or unusual character patterns.',
           },
           {
                      id: 5,
                      title: 'LinkedIn Profile Analysis',
                      difficulty: 'Easy',
                      flag: 'THINK{LINKEDIN_INTELLIGENCE_ACE}',
                      description: 'Investigate a LinkedIn profile suspected of being a fake account used for social engineering.',
                      objective: 'Analyze the profile and extract the hidden flag',
                      targetProfile: 'John Smith - Security Analyst',
                      lastActivity: 'Profile updated 2 days ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Low',
                      caseType: 'Fake Profile Investigation',
                      hint1: 'Look for inconsistencies in work history, connections, endorsements, and profile photo reverse image search.',
                      hint2: 'The flag is THINK{LINKEDIN_INTELLIGENCE_ACE}. Check the "About" section and recent activity for encoded messages.',
           },
           {
                      id: 6,
                      title: 'GitHub Repository Hunt',
                      difficulty: 'Easy',
                      flag: 'THINK{GITHUB_SECRET_FINDER}',
                      description: 'A developer accidentally pushed sensitive credentials to a public GitHub repository.',
                      objective: 'Search commit history and find the exposed flag',
                      targetProfile: 'github.com/devuser123/web-app',
                      lastActivity: 'Repository updated 8 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Low',
                      caseType: 'Code Repository Investigation',
                      hint1: 'Check commit history, especially files like .env, config files, or deleted commits. Use GitHub search operators.',
                      hint2: 'The flag THINK{GITHUB_SECRET_FINDER} was committed in an old config file. Look at the commit messages.',
           },
           {
                      id: 7,
                      title: 'Instagram Geotag Analysis',
                      difficulty: 'Easy',
                      flag: 'THINK{INSTAGRAM_LOCATION_TRACKER}',
                      description: 'An Instagram account is posting suspicious photos with location tags. Track their movements.',
                      objective: 'Analyze geotagged posts and extract the flag',
                      targetProfile: '@travel_enthusiast_2025',
                      lastActivity: 'Story posted 5 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Low',
                      caseType: 'Social Media Tracking',
                      hint1: 'Look at the location tags on recent posts. Map out the locations and look for patterns in captions.',
                      hint2: 'The flag THINK{INSTAGRAM_LOCATION_TRACKER} is hidden in the location name of the most recent post.',
           },
           {
                      id: 1,
                      title: 'Geolocation Investigation',
                      difficulty: 'Medium',
                      flag: 'THINK{PHOTO_GEOLOCATION_MASTER}',
                      description: 'A suspicious social media account has been posting photos with embedded geolocation data.',
                      objective: 'Extract flag from image metadata',
                      targetProfile: '@cyber_analyst_2025',
                      lastActivity: 'Photo posted 24 hours ago',
                      date: 'December 9, 2025',
                      alertLevel: 'Medium',
                      caseType: 'Social Engineering Investigation',
                      hint1: 'Use EXIF metadata viewers to inspect the image. Look for GPS coordinates, camera info, and custom comment fields.',
                      hint2: 'The flag format is THINK{PHOTO_GEOLOCATION_MASTER}. Check the image description or artist field in metadata.',
           },
           {
                      id: 4,
                      title: 'Domain Reconnaissance',
                      difficulty: 'Medium',
                      flag: 'THINK{DOMAIN_WHOIS_EXPERT}',
                      description: 'A phishing campaign is using a suspicious domain. Perform WHOIS lookup and DNS analysis.',
                      objective: 'Extract registration details and find the flag',
                      targetProfile: 'suspicious-bank-login.com',
                      lastActivity: 'Domain registered 3 days ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Medium',
                      caseType: 'Phishing Investigation',
                      hint1: 'Use WHOIS lookup tools to find domain registration details, nameservers, and registrar information.',
                      hint2: 'The flag is THINK{DOMAIN_WHOIS_EXPERT}. Check the registrant organization and creation date patterns.',
           },
           {
                      id: 8,
                      title: 'IP Address Geolocation',
                      difficulty: 'Medium',
                      flag: 'THINK{IP_GEOLOCATION_MASTER}',
                      description: 'Trace a suspicious IP address involved in unauthorized access attempts to your network.',
                      objective: 'Geolocate the IP and extract information',
                      targetProfile: '203.0.113.42',
                      lastActivity: 'Last access attempt 1 hour ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Medium',
                      caseType: 'Network Investigation',
                      hint1: 'Use IP geolocation services, WHOIS lookup, and check if the IP is listed in threat databases.',
                      hint2: 'The flag THINK{IP_GEOLOCATION_MASTER} is related to the ISP and country code of the IP address.',
           },
           {
                      id: 10,
                      title: 'Phone Number OSINT',
                      difficulty: 'Medium',
                      flag: 'THINK{PHONE_OSINT_EXPERT}',
                      description: 'A suspicious phone number has been used in multiple phishing campaigns. Investigate its origins.',
                      objective: 'Trace the phone number and find connected accounts',
                      targetProfile: '+1-555-0123-4567',
                      lastActivity: 'Last call made 4 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'Medium',
                      caseType: 'Telecommunications Investigation',
                      hint1: 'Use reverse phone lookup services, check social media accounts linked to the number, and search for data breaches.',
                      hint2: 'The flag THINK{PHONE_OSINT_EXPERT} is found in the carrier information and registration country.',
           },
           {
                      id: 3,
                      title: 'Email Breach Investigation',
                      difficulty: 'Advanced',
                      flag: 'THINK{EMAIL_BREACH_DETECTIVE}',
                      description: 'A company suspects their employee emails have been compromised. Analyze the breach data.',
                      objective: 'Identify the breach source and extract the flag',
                      targetProfile: 'employee@techcorp.com',
                      lastActivity: 'Suspicious login 6 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'High',
                      caseType: 'Data Breach Investigation',
                      hint1: 'Use haveibeenpwned or similar services to check if the email appears in any known breaches.',
                      hint2: 'The flag is constructed from: THINK{EMAIL_BREACH_DETECTIVE}. Look at breach timestamps and affected services.',
           },
           {
                      id: 9,
                      title: 'Dark Web Marketplace Analysis',
                      difficulty: 'Advanced',
                      flag: 'THINK{DARKWEB_INVESTIGATOR}',
                      description: 'Investigate a dark web marketplace selling stolen credentials and identify the operator.',
                      objective: 'Analyze marketplace data and extract the flag',
                      targetProfile: 'marketplace_admin_xyz',
                      lastActivity: 'Last login 3 hours ago',
                      date: 'December 14, 2025',
                      alertLevel: 'High',
                      caseType: 'Dark Web Investigation',
                      hint1: 'Analyze vendor profiles, payment addresses, PGP keys, and forum posts for identifying information.',
                      hint2: 'The flag THINK{DARKWEB_INVESTIGATOR} is hidden in the admin\'s PGP key fingerprint or Bitcoin address.',
           },
];

const OSINTCTF = () => {
           const [selectedChallenge, setSelectedChallenge] = useState(null);
           const [flagInput, setFlagInput] = useState('');
           const [message, setMessage] = useState('');
           const [messageType, setMessageType] = useState('');
           const [hintLevel, setHintLevel] = useState(0);

           const handleChallengeSelect = (challenge) => {
                      setSelectedChallenge(challenge);
                      setFlagInput('');
                      setMessage('');
                      setMessageType('');
                      setHintLevel(0);
           };

           const handleBackToList = () => {
                      setSelectedChallenge(null);
                      setFlagInput('');
                      setMessage('');
                      setMessageType('');
                      setHintLevel(0);
           };

           const handleSubmit = (e) => {
                      e.preventDefault();

                      if (flagInput.trim() === selectedChallenge.flag) {
                                 setMessage('🎉 Excellent! You successfully completed this OSINT challenge!');
                                 setMessageType('success');
                      } else {
                                 setMessage('❌ Incorrect flag. Analyze the information more carefully!');
                                 setMessageType('error');
                      }
           };

           const downloadClueFile = () => {
                      if (!selectedChallenge) return;

                      const clueData = `OSINT Investigation Clues
================================

Challenge: ${selectedChallenge.title}
Target Profile: ${selectedChallenge.targetProfile}
Last Activity: ${selectedChallenge.lastActivity}
Case Type: ${selectedChallenge.caseType}

Investigation Tips:
${selectedChallenge.id === 1 ? `- Check GPS coordinates
- Review EXIF data
- Look for embedded comments
- Analyze timestamps` : ''}
${selectedChallenge.id === 2 ? `- Analyze Twitter bio and profile
- Check for encoded messages
- Review recent tweets
- Look at follower patterns` : ''}
${selectedChallenge.id === 3 ? `- Use breach checking tools
- Analyze login timestamps
- Check IP addresses
- Review affected services` : ''}
${selectedChallenge.id === 4 ? `- Perform WHOIS lookup
- Check DNS records
- Analyze nameservers
- Review SSL certificates` : ''}
${selectedChallenge.id === 5 ? `- Reverse image search profile photo
- Check work history consistency
- Analyze connections network
- Review endorsements patterns` : ''}

Good luck, investigator!`;

                      const blob = new Blob([clueData], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `osint_clues_challenge_${selectedChallenge.id}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
           };

           const downloadEvidence = () => {
                      if (!selectedChallenge) return;

                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 600;
                      const ctx = canvas.getContext('2d');

                      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
                      gradient.addColorStop(0, '#1a1a2e');
                      gradient.addColorStop(1, '#16213e');
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, 800, 600);

                      ctx.fillStyle = '#ff8c00';
                      ctx.font = 'bold 48px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('ThinkSecure', 400, 200);

                      ctx.fillStyle = '#00ff00';
                      ctx.font = '24px Arial';
                      ctx.fillText(selectedChallenge.title, 400, 260);

                      ctx.fillStyle = '#cccccc';
                      ctx.font = '18px Arial';
                      ctx.fillText(`Target: ${selectedChallenge.targetProfile}`, 400, 320);
                      ctx.fillText(`Case: ${selectedChallenge.caseType}`, 400, 360);
                      ctx.fillText(`Alert Level: ${selectedChallenge.alertLevel}`, 400, 400);
                      ctx.fillText('Analyze this evidence carefully', 400, 460);

                      canvas.toBlob((blob) => {
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `challenge_${selectedChallenge.id}_evidence.png`;
                                 a.click();
                                 URL.revokeObjectURL(url);
                      });
           };

           if (!selectedChallenge) {
                      return (
                                 <div className="osint-ctf-container">
                                            <div className="osint-ctf-header">
                                                       <h1>OSINT CTF Lab</h1>
                                                       <p>Choose an Open Source Intelligence challenge to investigate</p>
                                            </div>

                                            <div className="challenges-selection">
                                                       <h2>📋 Available Investigations</h2>
                                                       <div className="challenges-grid-osint">
                                                                  {challenges.map((challenge) => (
                                                                             <div key={challenge.id} className="challenge-card-osint">
                                                                                        <div className="challenge-badge">
                                                                                                   <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                                                                                                              {challenge.difficulty}
                                                                                                   </span>
                                                                                        </div>
                                                                                        <h3>{challenge.title}</h3>
                                                                                        <p className="challenge-desc">{challenge.description}</p>
                                                                                        <div className="challenge-details">
                                                                                                   <p><strong>Target:</strong> {challenge.targetProfile}</p>
                                                                                                   <p><strong>Objective:</strong> {challenge.objective}</p>
                                                                                        </div>
                                                                                        <button
                                                                                                   className="start-challenge-btn"
                                                                                                   onClick={() => handleChallengeSelect(challenge)}
                                                                                        >
                                                                                                   Start Investigation
                                                                                        </button>
                                                                             </div>
                                                                  ))}
                                                       </div>
                                            </div>
                                 </div>
                      );
           }

           return (
                      <div className="osint-ctf-container">
                                 <div className="osint-ctf-header">
                                            <button className="back-btn" onClick={handleBackToList}>
                                                       ← Back to Challenges
                                            </button>
                                            <h1>OSINT CTF Lab - {selectedChallenge.title}</h1>
                                            <p>Use Open Source Intelligence techniques to extract hidden information</p>
                                 </div>

                                 <div className="ctf-scenario-osint">
                                            <h2>🔍 Investigation Brief</h2>
                                            <div className="scenario-content-osint">
                                                       <p>
                                                                  <strong>Date:</strong> {selectedChallenge.date}<br />
                                                                  <strong>Alert Level:</strong> {selectedChallenge.alertLevel}<br />
                                                                  <strong>Case Type:</strong> {selectedChallenge.caseType}
                                                       </p>
                                                       <p>{selectedChallenge.description}</p>
                                                       <p>
                                                                  <strong>Target Profile:</strong> {selectedChallenge.targetProfile}<br />
                                                                  <strong>Last Activity:</strong> {selectedChallenge.lastActivity}<br />
                                                                  <strong>Objective:</strong> {selectedChallenge.objective}
                                                       </p>
                                            </div>
                                 </div>

                                 <div className="evidence-section-osint">
                                            <h2>📂 Evidence & Resources</h2>
                                            <div className="evidence-preview">
                                                       <div className="evidence-placeholder">
                                                                  <div className="evidence-icon">🔍</div>
                                                                  <p>Investigation Evidence</p>
                                                                  <p className="evidence-filename">challenge_{selectedChallenge.id}_evidence.png</p>
                                                       </div>
                                            </div>
                                            <p className="evidence-note-osint">
                                                       <strong>Note:</strong> Download the evidence file and clue document to help with your investigation.
                                            </p>
                                            <div className="download-buttons">
                                                       <button className="download-btn-osint" onClick={downloadEvidence}>
                                                                  📥 Download Evidence
                                                       </button>
                                                       <button className="download-btn-osint secondary" onClick={downloadClueFile}>
                                                                  📄 Download Clue File
                                                       </button>
                                            </div>
                                 </div>

                                 <div className="hint-section-osint">
                                            <h3>💡 Investigation Hints</h3>
                                            {hintLevel === 0 && (
                                                       <button className="hint-btn-osint" onClick={() => setHintLevel(1)}>
                                                                  Show Hint 1
                                                       </button>
                                            )}
                                            {hintLevel >= 1 && (
                                                       <div className="hint-box">
                                                                  <p><strong>Hint 1:</strong> {selectedChallenge.hint1}</p>
                                                                  {hintLevel === 1 && (
                                                                             <button className="hint-btn-osint" onClick={() => setHintLevel(2)}>
                                                                                        Show Hint 2
                                                                             </button>
                                                                  )}
                                                       </div>
                                            )}
                                            {hintLevel >= 2 && (
                                                       <div className="hint-box">
                                                                  <p><strong>Hint 2:</strong> {selectedChallenge.hint2}</p>
                                                       </div>
                                            )}
                                 </div>

                                 <div className="flag-submission-osint">
                                            <h2>🚩 Submit Flag</h2>
                                            <form onSubmit={handleSubmit}>
                                                       <input
                                                                  type="text"
                                                                  value={flagInput}
                                                                  onChange={(e) => setFlagInput(e.target.value)}
                                                                  placeholder="Enter flag: THINK{...}"
                                                                  className="flag-input-osint"
                                                       />
                                                       <button type="submit" className="submit-flag-btn-osint">
                                                                  Submit Flag
                                                       </button>
                                            </form>
                                            {message && (
                                                       <div className={`flag-message-osint ${messageType}`}>
                                                                  {message}
                                                       </div>
                                            )}
                                 </div>

                                 <div className="learning-section-osint">
                                            <h3>📚 OSINT Techniques</h3>
                                            <ul>
                                                       <li>Open Source Intelligence gathering methods</li>
                                                       <li>Social media profile analysis techniques</li>
                                                       <li>Metadata extraction and analysis</li>
                                                       <li>Digital footprint investigation</li>
                                                       <li>Privacy and security implications of public data</li>
                                            </ul>
                                 </div>
                      </div>
           );
};

export default OSINTCTF;
