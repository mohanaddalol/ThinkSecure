import React, { useState } from 'react';
import './ForensicsCTF.css';

const ForensicsCTF = () => {
           const [flagInput, setFlagInput] = useState('');
           const [message, setMessage] = useState('');
           const [messageType, setMessageType] = useState('');
           const [showHint, setShowHint] = useState(false);

           const correctFlag = 'THINK{LOG_FORENSICS_MASTER}';

           const securityLogs = [
                      '[2025-12-09 02:15:33] INFO: System startup completed successfully',
                      '[2025-12-09 02:16:05] INFO: User login: john.smith from 192.168.1.45',
                      '[2025-12-09 02:18:22] WARNING: Failed login attempt for admin from 10.0.0.87',
                      '[2025-12-09 02:18:45] WARNING: Failed login attempt for admin from 10.0.0.87',
                      '[2025-12-09 02:19:01] WARNING: Failed login attempt for admin from 10.0.0.87',
                      '[2025-12-09 02:19:34] CRITICAL: Brute force attack detected from 10.0.0.87',
                      '[2025-12-09 02:20:15] INFO: IP 10.0.0.87 has been blocked automatically',
                      '[2025-12-09 02:23:47] INFO: User logout: john.smith',
                      '[2025-12-09 03:05:19] WARNING: Unusual PowerShell execution detected',
                      '[2025-12-09 03:05:19] DETAIL: Process: powershell.exe -ExecutionPolicy Bypass -File scan.ps1',
                      '[2025-12-09 03:05:20] DETAIL: Parent Process: explorer.exe (PID: 2456)',
                      '[2025-12-09 03:06:44] WARNING: Suspicious file created: C:\\\\Temp\\\\data_export.zip',
                      '[2025-12-09 03:06:45] INFO: File hash: SHA256:a3f5b9c8d2e1f4a7b6c9d8e7f6a5b4c3',
                      '[2025-12-09 03:08:12] CRITICAL: Outbound connection to 203.0.113.42:4444',
                      '[2025-12-09 03:08:13] DETAIL: Connection blocked by firewall',
                      '[2025-12-09 03:10:28] INFO: Security scan initiated by admin',
                      '[2025-12-09 03:10:29] INFO: Scanning 247 processes and 1,893 files',
                      '[2025-12-09 03:12:55] WARNING: Registry modification detected: HKLM\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run',
                      '[2025-12-09 03:12:56] DETAIL: New value: "SystemUpdate" = "C:\\\\Windows\\\\Temp\\\\update.exe"',
                      '[2025-12-09 03:15:33] CRITICAL: Malware signature detected in C:\\\\Windows\\\\Temp\\\\update.exe',
                      '[2025-12-09 03:15:34] INFO: File quarantined successfully',
                      '[2025-12-09 03:16:02] INFO: Incident response initiated - investigation-id=THINK{LOG_FORENSICS_MASTER}',
                      '[2025-12-09 03:18:45] INFO: All suspicious processes terminated',
                      '[2025-12-09 03:19:12] INFO: System restored to safe state',
                      '[2025-12-09 03:20:00] INFO: Full system scan scheduled for 04:00 AM',
                      '[2025-12-09 03:22:18] INFO: User login: security.admin from 192.168.1.10',
                      '[2025-12-09 03:25:44] INFO: Security review completed - no additional threats found',
                      '[2025-12-09 03:30:00] INFO: Backup created: backup_2025-12-09_033000.bak',
                      '[2025-12-09 03:35:15] INFO: Email notification sent to security team',
                      '[2025-12-09 03:40:22] INFO: Case documented in incident database',
                      '[2025-12-09 03:45:00] INFO: Monitoring resumed - normal operation',
           ];

           const handleSubmit = (e) => {
                      e.preventDefault();

                      if (flagInput.trim() === correctFlag) {
                                 setMessage('🎉 Correct! You successfully identified the incident investigation ID!');
                                 setMessageType('success');
                      } else {
                                 setMessage('❌ Incorrect flag. Review the logs more carefully!');
                                 setMessageType('error');
                      }
           };

           return (
                      <div className="forensics-ctf-container">
                                 <div className="forensics-ctf-header">
                                            <h1>Forensics CTF Lab - SOC Log Analysis</h1>
                                            <p>Analyze security logs to identify and extract the incident investigation ID</p>
                                 </div>

                                 <div className="ctf-scenario-forensics">
                                            <h2>🔍 Investigation Brief</h2>
                                            <div className="scenario-content-forensics">
                                                       <p>
                                                                  <strong>Date:</strong> December 9, 2025<br />
                                                                  <strong>Alert Level:</strong> Critical<br />
                                                                  <strong>Case Type:</strong> Malware Incident Response
                                                       </p>
                                                       <p>
                                                                  A suspicious activity was detected on one of our servers early this morning.
                                                                  The SOC team has collected security logs from the affected system.
                                                       </p>
                                                       <p>
                                                                  Your task is to analyze these logs, identify the security incident, and locate
                                                                  the investigation ID that was assigned when the incident response was initiated.
                                                       </p>
                                                       <p>
                                                                  <strong>Mission:</strong> Find the flag hidden within the log entries.
                                                       </p>
                                            </div>
                                 </div>

                                 <div className="log-viewer-section">
                                            <h2>📋 Security Logs - Server-WEB-01</h2>
                                            <div className="log-viewer">
                                                       {securityLogs.map((log, index) => {
                                                                  let logClass = 'log-line';
                                                                  if (log.includes('CRITICAL')) logClass += ' critical';
                                                                  else if (log.includes('WARNING')) logClass += ' warning';
                                                                  else if (log.includes('INFO')) logClass += ' info';

                                                                  return (
                                                                             <div key={index} className={logClass}>
                                                                                        {log}
                                                                             </div>
                                                                  );
                                                       })}
                                            </div>
                                 </div>

                                 <div className="hint-section-forensics">
                                            <button className="hint-toggle-forensics" onClick={() => setShowHint(!showHint)}>
                                                       {showHint ? '🔼 Hide Hints' : '💡 Need Hints?'}
                                            </button>
                                            {showHint && (
                                                       <div className="hint-content-forensics">
                                                                  <p><strong>Hint 1:</strong> Look for log entries that indicate an incident response was initiated.</p>
                                                                  <p><strong>Hint 2:</strong> Investigation IDs are typically assigned when security incidents are formally documented.</p>
                                                                  <p><strong>Hint 3:</strong> Search for keywords like "investigation-id" or "incident" in the logs.</p>
                                                                  <p><strong>Hint 4:</strong> The flag follows the format: THINK&#123;...&#125;</p>
                                                       </div>
                                            )}
                                 </div>

                                 <div className="flag-submission-forensics">
                                            <h2>🚩 Submit Investigation ID</h2>
                                            <form onSubmit={handleSubmit}>
                                                       <input
                                                                  type="text"
                                                                  value={flagInput}
                                                                  onChange={(e) => setFlagInput(e.target.value)}
                                                                  placeholder="Enter flag: THINK{...}"
                                                                  className="flag-input-forensics"
                                                       />
                                                       <button type="submit" className="submit-flag-btn-forensics">
                                                                  Submit Flag
                                                       </button>
                                            </form>
                                            {message && (
                                                       <div className={`flag-message-forensics ${messageType}`}>
                                                                  {message}
                                                       </div>
                                            )}
                                 </div>

                                 <div className="learning-section-forensics">
                                            <h3>📚 What You Learned</h3>
                                            <ul>
                                                       <li>How to read and interpret security log entries</li>
                                                       <li>Identifying critical security events in log data</li>
                                                       <li>Recognizing malware indicators and attack patterns</li>
                                                       <li>Understanding the incident response timeline</li>
                                                       <li>The importance of logging for forensic investigations</li>
                                            </ul>
                                 </div>
                      </div>
           );
};

export default ForensicsCTF;
