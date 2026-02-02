import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { API_URL } from './api';
import Certificate from './Certificate';

// Fetch leaderboard from backend API
function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchLeaderboard();

    // Auto-refresh every 30 seconds to match backend cache
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/challenges/leaderboard`, {
        headers: {
          'Cache-Control': 'max-age=30'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Unable to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: '#ff4444' }}>{error}</p>
        <button onClick={fetchLeaderboard} style={{ margin: '0 auto', display: 'block' }}>
          Retry
        </button>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          No scores yet. Be the first to solve a challenge!
        </p>
      </div>
    );
  }

  const handleViewCertificate = (rank, username, score) => {
    setSelectedCertificate({ rank, username, totalScore: score });
  };

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">Leaderboard</h2>

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="podium-container">
          {/* 2nd Place */}
          <div className="podium-card second-place">
            <div className="podium-rank">2nd</div>
            <div className="podium-username">{leaderboardData[1].username}</div>
            <div className="podium-score">{leaderboardData[1].score} pts</div>
            <button
              className="view-certificate-btn silver"
              onClick={() => handleViewCertificate(2, leaderboardData[1].username, leaderboardData[1].score)}
              title="View Certificate"
            >
              🥈 View Certificate
            </button>
          </div>

          {/* 1st Place */}
          <div className="podium-card first-place">
            <div className="podium-rank">1st</div>
            <div className="podium-username">{leaderboardData[0].username}</div>
            <div className="podium-score">{leaderboardData[0].score} pts</div>
            <button
              className="view-certificate-btn gold"
              onClick={() => handleViewCertificate(1, leaderboardData[0].username, leaderboardData[0].score)}
              title="View Certificate"
            >
              🥇 View Certificate
            </button>
          </div>

          {/* 3rd Place */}
          <div className="podium-card third-place">
            <div className="podium-rank">3rd</div>
            <div className="podium-username">{leaderboardData[2].username}</div>
            <div className="podium-score">{leaderboardData[2].score} pts</div>
            <button
              className="view-certificate-btn bronze"
              onClick={() => handleViewCertificate(3, leaderboardData[2].username, leaderboardData[2].score)}
              title="View Certificate"
            >
              🥉 View Certificate
            </button>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Challenges Solved</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(player => (
            <tr key={player.rank}>
              <td>{player.rank}</td>
              <td>{player.username}</td>
              <td>{player.score}</td>
              <td>{player.challengesSolved}</td>
              <td>
                {player.rank <= 3 ? (
                  <button
                    className="table-certificate-btn"
                    onClick={() => handleViewCertificate(player.rank, player.username, player.score)}
                  >
                    {player.rank === 1 && '🥇'}
                    {player.rank === 2 && '🥈'}
                    {player.rank === 3 && '🥉'}
                    {' View'}
                  </button>
                ) : (
                  <span style={{ color: '#999', fontSize: '14px' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <Certificate
          rank={selectedCertificate.rank}
          username={selectedCertificate.username}
          totalScore={selectedCertificate.totalScore}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}

export default Leaderboard;
