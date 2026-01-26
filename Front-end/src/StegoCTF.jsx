import React, { useState } from 'react';
import './StegoCTF.css';
import { submitChallenge } from './api';

const challenges = [
           {
                      id: 1,
                      title: 'Appended Text Challenge',
                      flag: 'THINK{APPENDED_DATA_FOUND}',
                      description: 'A simple image file has text data appended after the PNG end marker.',
                      objective: 'Extract the flag from appended text data',
                      fileType: 'PNG Image',
                      technique: 'Appended Data Analysis',
                      date: 'December 14, 2025',
                      classification: 'Beginner',
                      hint1: 'Open the image in a text editor or use the "strings" command to view hidden text.',
                      hint2: 'The flag THINK{APPENDED_DATA_FOUND} is at the end of the file after the PNG EOF marker.',
           },
           {
                      id: 2,
                      title: 'EXIF Metadata Hunt',
                      flag: 'THINK{EXIF_METADATA_MASTER}',
                      description: 'The flag is hidden in the EXIF metadata fields of a photograph.',
                      objective: 'Extract flag from image metadata',
                      fileType: 'JPEG Image',
                      technique: 'EXIF Metadata Extraction',
                      date: 'December 14, 2025',
                      classification: 'Beginner',
                      hint1: 'Use ExifTool or an online EXIF viewer to check the Author, Comment, or Copyright fields.',
                      hint2: 'The flag THINK{EXIF_METADATA_MASTER} is in the "ImageDescription" EXIF field.',
           },
           {
                      id: 3,
                      title: 'Base64 Image Embedding',
                      flag: 'THINK{BASE64_DECODED_SUCCESS}',
                      description: 'A flag is encoded in Base64 and hidden within the image comment.',
                      objective: 'Decode Base64 data to reveal the flag',
                      fileType: 'PNG Image',
                      technique: 'Base64 Decoding',
                      date: 'December 14, 2025',
                      classification: 'Beginner',
                      hint1: 'Look for Base64-encoded text in the image metadata or appended data.',
                      hint2: 'Decode the Base64 string to get THINK{BASE64_DECODED_SUCCESS}.',
           },
           {
                      id: 4,
                      title: 'Color Palette Steganography',
                      flag: 'THINK{PALETTE_COLORS_REVEAL}',
                      description: 'The flag is hidden in the color palette indices of a GIF file.',
                      objective: 'Analyze color palette for hidden data',
                      fileType: 'GIF Image',
                      technique: 'Palette Analysis',
                      date: 'December 14, 2025',
                      classification: 'Beginner',
                      hint1: 'Extract the color palette and look for ASCII values or patterns in RGB values.',
                      hint2: 'The flag THINK{PALETTE_COLORS_REVEAL} is encoded in the palette color sequence.',
           },
           {
                      id: 5,
                      title: 'LSB Steganography',
                      flag: 'THINK{LSB_BITS_EXTRACTED}',
                      description: 'Data is hidden in the least significant bits of pixel values.',
                      objective: 'Extract LSB data from image pixels',
                      fileType: 'PNG Image',
                      technique: 'LSB Extraction',
                      date: 'December 14, 2025',
                      classification: 'Intermediate',
                      hint1: 'Use zsteg or stegsolve to analyze the LSB of each color channel.',
                      hint2: 'The flag THINK{LSB_BITS_EXTRACTED} is hidden in the red channel LSB.',
           },
           {
                      id: 6,
                      title: 'Steghide Password Protected',
                      flag: 'THINK{STEGHIDE_UNLOCKED}',
                      description: 'Data is embedded using Steghide with a password. Find the password and extract.',
                      objective: 'Crack password and extract embedded data',
                      fileType: 'JPEG Image',
                      technique: 'Steghide Extraction',
                      date: 'December 14, 2025',
                      classification: 'Intermediate',
                      hint1: 'Common passwords: password, 123456, secret. Try brute-forcing with steghide extract.',
                      hint2: 'The password is "secret". Extract with: steghide extract -sf image.jpg -p secret',
           },
           {
                      id: 7,
                      title: 'Multi-Layer Steganography',
                      flag: 'THINK{MULTI_LAYER_DECODED}',
                      description: 'The flag is hidden using multiple steganography techniques in layers.',
                      objective: 'Decode multiple layers to find the flag',
                      fileType: 'PNG Image',
                      technique: 'Multi-Layer Analysis',
                      date: 'December 14, 2025',
                      classification: 'Intermediate',
                      hint1: 'Check EXIF first, then look for appended data, finally analyze LSB.',
                      hint2: 'The flag THINK{MULTI_LAYER_DECODED} requires extracting data from 3 different locations.',
           },
           {
                      id: 8,
                      title: 'Audio Spectrogram Analysis',
                      flag: 'THINK{AUDIO_SPECTRUM_FOUND}',
                      description: 'A flag is hidden in the spectrogram of an audio file embedded in the image.',
                      objective: 'Extract and analyze audio spectrogram',
                      fileType: 'WAV Audio + PNG',
                      technique: 'Spectrogram Analysis',
                      date: 'December 14, 2025',
                      classification: 'Intermediate',
                      hint1: 'Extract the WAV file and view its spectrogram using Audacity or Sonic Visualizer.',
                      hint2: 'The flag THINK{AUDIO_SPECTRUM_FOUND} appears visually in the spectrogram.',
           },
           {
                      id: 9,
                      title: 'QR Code in Alpha Channel',
                      flag: 'THINK{ALPHA_QR_SCANNED}',
                      description: 'A QR code is hidden in the alpha transparency channel of a PNG image.',
                      objective: 'Extract alpha channel and decode QR code',
                      fileType: 'PNG Image with Alpha',
                      technique: 'Alpha Channel Extraction',
                      date: 'December 14, 2025',
                      classification: 'Advanced',
                      hint1: 'Extract the alpha channel as a separate image and look for patterns.',
                      hint2: 'The alpha channel contains a QR code. Scan it to get THINK{ALPHA_QR_SCANNED}.',
           },
           {
                      id: 10,
                      title: 'Encrypted Zip in Image',
                      flag: 'THINK{ZIP_ENCRYPTED_CRACKED}',
                      description: 'An encrypted ZIP file is hidden within the image. Extract and crack it.',
                      objective: 'Extract ZIP file and crack the password',
                      fileType: 'PNG with embedded ZIP',
                      technique: 'File Carving & Password Cracking',
                      date: 'December 14, 2025',
                      classification: 'Advanced',
                      hint1: 'Use binwalk or foremost to extract the embedded ZIP file from the image.',
                      hint2: 'Crack the ZIP password with John the Ripper or fcrackzip. Password is "cyber123".',
           },
];

const StegoCTF = () => {
           const [selectedChallenge, setSelectedChallenge] = useState(null);
           const [flagInput, setFlagInput] = useState('');
           const [message, setMessage] = useState('');
           const [messageType, setMessageType] = useState('');
           const [hintLevel, setHintLevel] = useState(0);
           const [isSubmitting, setIsSubmitting] = useState(false);

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

           const handleSubmit = async (e) => {
                      e.preventDefault();

                      const isCorrect = flagInput.trim() === selectedChallenge.flag;

                      // Check if user is logged in
                      const token = localStorage.getItem('token');
                      if (!token) {
                                 if (isCorrect) {
                                            setMessage('✅ Correct flag! Please log in to earn points.');
                                            setMessageType('success');
                                 } else {
                                            setMessage('❌ Incorrect flag. Use steganography tools to analyze the image!');
                                            setMessageType('error');
                                 }
                                 return;
                      }

                      // Submit to backend for scoring
                      setIsSubmitting(true);
                      try {
                                 const response = await submitChallenge(
                                            selectedChallenge.id.toString(),
                                            'Steganography',
                                            'Advanced', // Steganography CTF Lab is Advanced level (50 points for all challenges)
                                            isCorrect
                                 );

                                 if (response.alreadySolved) {
                                            setMessage('⚠️ You already solved this challenge!');
                                            setMessageType('warning');
                                 } else if (isCorrect && response.pointsEarned > 0) {
                                            setMessage(`🎉 Perfect! You earned ${response.pointsEarned} points! Total: ${response.totalScore} points`);
                                            setMessageType('success');
                                 } else if (isCorrect) {
                                            setMessage('✅ Correct flag!');
                                            setMessageType('success');
                                 } else {
                                            setMessage('❌ Incorrect flag. Use steganography tools to analyze the image!');
                                            setMessageType('error');
                                 }
                      } catch (error) {
                                 console.error('Submission error:', error);
                                 if (isCorrect) {
                                            setMessage('✅ Correct flag! (Score tracking unavailable)');
                                            setMessageType('success');
                                 } else {
                                            setMessage('❌ Incorrect flag. Use steganography tools to analyze the image!');
                                            setMessageType('error');
                                 }
                      } finally {
                                 setIsSubmitting(false);
                      }
           };

           const downloadInstructionsFile = () => {
                      if (!selectedChallenge) return;

                      const instructions = `Steganography Challenge Instructions
========================================

Challenge: ${selectedChallenge.title}
Technique: ${selectedChallenge.technique}
File Type: ${selectedChallenge.fileType}

Mission: Extract the hidden flag from the challenge file

Tools You May Need:
-------------------
1. ExifTool - View EXIF metadata
2. Strings command - Extract text from binary
3. Hex editor - View raw file data
4. zsteg - PNG/BMP analysis
5. Steghide - Extract hidden data
6. Binwalk - File carving tool

Analysis Steps:
---------------
1. Download the challenge file
2. Check file type and metadata
3. Apply appropriate steganography technique
4. Extract hidden data
5. Decode/decrypt if necessary

The flag format is: THINK{...}

Good luck, steganographer!`;

                      const blob = new Blob([instructions], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `stego_instructions_challenge_${selectedChallenge.id}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
           };

           const downloadChallengeFile = () => {
                      if (!selectedChallenge) return;

                      const canvas = document.createElement('canvas');
                      canvas.width = 1000;
                      canvas.height = 800;
                      const ctx = canvas.getContext('2d');

                      const gradient = ctx.createRadialGradient(500, 400, 100, 500, 400, 600);
                      gradient.addColorStop(0, '#2a2a2a');
                      gradient.addColorStop(0.5, '#1a1a1a');
                      gradient.addColorStop(1, '#0a0a0a');
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, 1000, 800);

                      for (let i = 0; i < 30; i++) {
                                 ctx.fillStyle = `rgba(255, 140, 0, ${Math.random() * 0.3})`;
                                 ctx.fillRect(Math.random() * 1000, Math.random() * 800, Math.random() * 100, Math.random() * 100);
                      }

                      ctx.fillStyle = '#ff8c00';
                      ctx.font = 'bold 56px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('ThinkSecure', 500, 300);

                      ctx.fillStyle = '#00ff00';
                      ctx.font = '32px Arial';
                      ctx.fillText(selectedChallenge.title, 500, 360);

                      ctx.fillStyle = '#cccccc';
                      ctx.font = '20px Arial';
                      ctx.fillText(`Technique: ${selectedChallenge.technique}`, 500, 420);
                      ctx.fillText(`Classification: ${selectedChallenge.classification}`, 500, 450);

                      ctx.strokeStyle = '#ff8c00';
                      ctx.lineWidth = 3;
                      ctx.strokeRect(50, 50, 900, 700);

                      ctx.fillStyle = '#666666';
                      ctx.font = '14px Courier New';
                      ctx.textAlign = 'left';
                      ctx.fillText(`Challenge ${selectedChallenge.id}: ${selectedChallenge.fileType}`, 70, 770);
                      ctx.fillText('Hidden data embedded using steganography', 70, 790);

                      canvas.toBlob((blob) => {
                                 const reader = new FileReader();
                                 reader.onload = function (e) {
                                            const arrayBuffer = e.target.result;
                                            const uint8Array = new Uint8Array(arrayBuffer);
                                            const hiddenData = new TextEncoder().encode(`\n\nHidden Data:\nFlag: ${selectedChallenge.flag}\nChallenge ID: ${selectedChallenge.id}\nTechnique: ${selectedChallenge.technique}\n`);
                                            const combinedArray = new Uint8Array(uint8Array.length + hiddenData.length);
                                            combinedArray.set(uint8Array);
                                            combinedArray.set(hiddenData, uint8Array.length);

                                            const finalBlob = new Blob([combinedArray], { type: 'image/png' });
                                            const url = URL.createObjectURL(finalBlob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `challenge_${selectedChallenge.id}_stego.png`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                 };
                                 reader.readAsArrayBuffer(blob);
                      }, 'image/png');
           };

           if (!selectedChallenge) {
                      return (
                                 <div className="stego-ctf-container">
                                            <div className="stego-ctf-header">
                                                       <h1>Steganography CTF Lab</h1>
                                                       <p>Choose a steganography challenge to analyze hidden data</p>
                                            </div>

                                            <div className="challenges-selection">
                                                       <h2>📋 Available Challenges</h2>
                                                       <div className="challenges-grid-stego">
                                                                  {challenges.map((challenge) => (
                                                                             <div key={challenge.id} className="challenge-card-stego">
                                                                                        <h3>{challenge.title}</h3>
                                                                                        <p className="challenge-desc">{challenge.description}</p>
                                                                                        <div className="challenge-details">
                                                                                                   <p><strong>Technique:</strong> {challenge.technique}</p>
                                                                                                   <p><strong>File Type:</strong> {challenge.fileType}</p>
                                                                                        </div>
                                                                                        <button
                                                                                                   className="start-challenge-btn"
                                                                                                   onClick={() => handleChallengeSelect(challenge)}
                                                                                        >
                                                                                                   Start Challenge
                                                                                        </button>
                                                                             </div>
                                                                  ))}
                                                       </div>
                                            </div>
                                 </div>
                      );
           }

           return (
                      <div className="stego-ctf-container">
                                 <div className="stego-ctf-header">
                                            <button className="back-btn" onClick={handleBackToList}>
                                                       ← Back to Challenges
                                            </button>
                                            <h1>Steganography CTF Lab - {selectedChallenge.title}</h1>
                                            <p>Discover hidden data concealed within digital files</p>
                                 </div>

                                 <div className="ctf-scenario-stego">
                                            <h2>🔍 Mission Brief</h2>
                                            <div className="scenario-content-stego">
                                                       <p>
                                                                  <strong>Date:</strong> {selectedChallenge.date}<br />
                                                                  <strong>Classification:</strong> {selectedChallenge.classification}<br />
                                                                  <strong>Technique:</strong> {selectedChallenge.technique}
                                                       </p>
                                                       <p>{selectedChallenge.description}</p>
                                                       <p>
                                                                  <strong>File Type:</strong> {selectedChallenge.fileType}<br />
                                                                  <strong>Objective:</strong> {selectedChallenge.objective}
                                                       </p>
                                            </div>
                                 </div>

                                 <div className="challenge-image-section">
                                            <h2>📂 Challenge File</h2>
                                            <div className="image-preview-stego">
                                                       <div className="image-frame">
                                                                  <div className="stego-placeholder">
                                                                             <div className="stego-icon">🖼️</div>
                                                                             <p>Challenge File Preview</p>
                                                                             <p className="image-details">challenge_{selectedChallenge.id}_stego.png</p>
                                                                             <p className="image-size">{selectedChallenge.fileType}</p>
                                                                  </div>
                                                       </div>
                                            </div>
                                            <div className="download-section-stego">
                                                       <button className="download-btn-stego primary" onClick={downloadChallengeFile}>
                                                                  📥 Download Challenge File
                                                       </button>
                                                       <button className="download-btn-stego" onClick={downloadInstructionsFile}>
                                                                  📄 Download Instructions
                                                       </button>
                                            </div>
                                 </div>

                                 <div className="hint-section-stego">
                                            <h3>💡 Analysis Hints</h3>
                                            {hintLevel === 0 && (
                                                       <button className="hint-btn-stego" onClick={() => setHintLevel(1)}>
                                                                  Show Hint 1
                                                       </button>
                                            )}
                                            {hintLevel >= 1 && (
                                                       <div className="hint-box-stego">
                                                                  <p><strong>Hint 1:</strong> {selectedChallenge.hint1}</p>
                                                                  {hintLevel === 1 && (
                                                                             <button className="hint-btn-stego" onClick={() => setHintLevel(2)}>
                                                                                        Show Hint 2
                                                                             </button>
                                                                  )}
                                                       </div>
                                            )}
                                            {hintLevel >= 2 && (
                                                       <div className="hint-box-stego">
                                                                  <p><strong>Hint 2:</strong> {selectedChallenge.hint2}</p>
                                                       </div>
                                            )}
                                 </div>

                                 <div className="flag-submission-stego">
                                            <h2>🚩 Submit Flag</h2>
                                            <form onSubmit={handleSubmit}>
                                                       <input
                                                                  type="text"
                                                                  value={flagInput}
                                                                  onChange={(e) => setFlagInput(e.target.value)}
                                                                  placeholder="Enter flag: THINK{...}"
                                                                  className="flag-input-stego"
                                                                  disabled={isSubmitting}
                                                       />
                                                       <button type="submit" className="submit-flag-btn-stego" disabled={isSubmitting}>
                                                                  {isSubmitting ? 'Submitting...' : 'Submit Flag'}
                                                       </button>
                                            </form>
                                            {message && (
                                                       <div className={`flag-message-stego ${messageType}`}>
                                                                  {message}
                                                       </div>
                                            )}
                                 </div>

                                 <div className="learning-section-stego">
                                            <h3>📚 Steganography Techniques</h3>
                                            <ul>
                                                       <li>Understanding various data hiding methods</li>
                                                       <li>Image and file format analysis</li>
                                                       <li>Metadata extraction and examination</li>
                                                       <li>Binary data analysis techniques</li>
                                                       <li>Digital forensics applications</li>
                                                       <li>Cybersecurity and covert communications</li>
                                            </ul>
                                 </div>
                      </div>
           );
};

export default StegoCTF;
