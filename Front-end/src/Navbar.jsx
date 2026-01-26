import React, { useState, useEffect } from "react";
import { getUserProgress } from "./api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    // Try to load user from localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
      fetchUserScore();
    }
  }, []);

  const fetchUserScore = async () => {
    try {
      const progress = await getUserProgress();
      setUserScore(progress.totalScore || 0);
    } catch (error) {
      console.error("Failed to fetch user score:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setUserScore(0);
    alert("Logged out successfully!");
  };

  return (
    <nav className="navbar">
      <h2>ThinkSecure</h2>
      <div className="nav-right">
        {!user ? (
          <>
            <button onClick={() => (window.location.href = "/login")}>
              Login
            </button>
            <button onClick={() => (window.location.href = "/signup")}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span>Welcome, {user.username}!</span>
            <span style={{
              color: '#00ff00',
              fontWeight: 'bold',
              marginLeft: '10px',
              padding: '5px 10px',
              background: 'rgba(0, 255, 0, 0.1)',
              borderRadius: '5px'
            }}>
              🏆 {userScore} pts
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
