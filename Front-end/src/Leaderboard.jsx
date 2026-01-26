import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { API_URL } from './api';

// Fetch leaderboard from backend API
function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/challenges/leaderboard`);

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

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>

      {leaderboardData.length >= 3 && (
        <div className="podium">
          <div className="podium-item silver">
            <span>2nd</span>
            <p>{leaderboardData[1].username}</p>
            <p>{leaderboardData[1].score} pts</p>
          </div>
          <div className="podium-item gold">
            <span>1st</span>
            <p>{leaderboardData[0].username}</p>
            <p>{leaderboardData[0].score} pts</p>
          </div>
          <div className="podium-item bronze">
            <span>3rd</span>
            <p>{leaderboardData[2].username}</p>
            <p>{leaderboardData[2].score} pts</p>
          </div>
        </div>
      )}

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Challenges Solved</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(player => (
            <tr key={player.rank}>
              <td>{player.rank}</td>
              <td>{player.username}</td>
              <td>{player.score}</td>
              <td>{player.challengesSolved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;