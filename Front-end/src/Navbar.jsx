import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to load user from localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
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
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
