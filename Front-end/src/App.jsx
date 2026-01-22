import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';

import Home from './Home';
import Challenges from './Challenges';
import Resources from './Resources';
import SecurityQuiz from './SecurityQuiz';
import CyberEscapeRoom from './CyberEscapeRoom';
import PasswordChallenge from './PasswordChallenge';
import AttackSimulator from './AttackSimulator';
import HackTheHacker from './HackTheHacker';
import HackTheHackerComplete from './HackTheHackerComplete';
import WebCTF from './WebCTF';
import ForensicsCTF from './ForensicsCTF';
import OSINTCTF from './OSINTCTF';
import StegoCTF from './StegoCTF';
import AuthModal from './AuthModal'; // ✅ New unified modal

// ProtectedRoute kept for compatibility but no longer blocks access.
// ✅ ProtectedRoute for blocking routes until login
function ProtectedRoute({ element: Component }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token && user ? Component : <Navigate to="/" replace />;
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('signup'); // 'signup' | 'login'
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState(null);
  const [intendedPath, setIntendedPath] = useState('/');
  const location = useLocation();
  const navigate = useNavigate();

  // Load user data when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Protected paths
  const protectedPaths = [
    '/challenges',
    '/resources',
    '/games/security-quiz',
    '/games/escape-room',
    '/games/password-challenge',
    '/games/attack-sim',
    '/games/hack-hacker',
    '/games/hack-hacker/complete',
    '/web-ctf',
    '/forensics-ctf',
    '/osint-ctf',
    '/stego-ctf',
  ];

  // When user navigates directly to protected page (via URL)
  useEffect(() => {
    if (protectedPaths.includes(location.pathname)) {
      const token = localStorage.getItem('token');
      if (!token) {
        setIntendedPath(location.pathname);
        setAuthDefaultTab('signup'); // 👈 default to Sign Up first
        setShowAuth(true);
      }
    }
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // When a user clicks a protected link
  const handleProtectedClick = (path) => (e) => {
    e.preventDefault();
    if (!user) {
      setIntendedPath(path);
      setAuthDefaultTab('signup'); // 👈 show Sign Up tab
      setShowAuth(true);
      setIsMenuOpen(false);
    } else {
      navigate(path);
      setIsMenuOpen(false);
    }
  };

  // On successful signup/login
  const handleAuthSuccess = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setShowAuth(false);
    setAlertMessage('');
    navigate(intendedPath || '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAlertMessage('You have been logged out successfully.');
    navigate('/');
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <img src="/favicon.png" alt="ThinkSecure Logo" className="logo-img" />
          <span>ThinkSecure</span>
        </Link>

        <button className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <a href="/challenges" onClick={handleProtectedClick('/challenges')}>
              Challenges
            </a>
          </li>
          <li>
            <a href="/resources" onClick={handleProtectedClick('/resources')}>
              Resources
            </a>
          </li>

          {!user ? (
            <>
              <li>
                <button
                  onClick={() => {
                    setAuthDefaultTab('login');
                    setShowAuth(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthDefaultTab('signup');
                    setShowAuth(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="welcome-text">Welcome, {user.username}</span>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Alert Message */}
      {alertMessage && (
        <div className="alert-message improved-alert">
          <p>
            <strong>Alert:</strong>
          </p>
          <p style={{ whiteSpace: 'pre-line' }}>{alertMessage}</p>
          <button onClick={() => setAlertMessage('')} className="alert-close">
            Got It!
          </button>
        </div>
      )}

      {/* Unified Auth Modal */}
      {showAuth && (
        <AuthModal
          defaultTab={authDefaultTab}
          onClose={() => setShowAuth(false)}
          onAuth={handleAuthSuccess}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/challenges"
          element={<ProtectedRoute element={<Challenges />} />}
        />
        <Route
          path="/resources"
          element={<ProtectedRoute element={<Resources />} />}
        />
        <Route
          path="/games/security-quiz"
          element={<ProtectedRoute element={<SecurityQuiz />} />}
        />
        <Route
          path="/games/escape-room"
          element={<ProtectedRoute element={<CyberEscapeRoom />} />}
        />
        <Route
          path="/games/password-challenge"
          element={<ProtectedRoute element={<PasswordChallenge />} />}
        />
        <Route
          path="/games/attack-sim"
          element={<ProtectedRoute element={<AttackSimulator />} />}
        />
        <Route
          path="/games/hack-hacker"
          element={<ProtectedRoute element={<HackTheHacker />} />}
        />
        <Route
          path="/games/hack-hacker/complete"
          element={<ProtectedRoute element={<HackTheHackerComplete />} />}
        />
        <Route
          path="/web-ctf"
          element={<ProtectedRoute element={<WebCTF />} />}
        />
        <Route
          path="/forensics-ctf"
          element={<ProtectedRoute element={<ForensicsCTF />} />}
        />
        <Route
          path="/osint-ctf"
          element={<ProtectedRoute element={<OSINTCTF />} />}
        />
        <Route
          path="/stego-ctf"
          element={<ProtectedRoute element={<StegoCTF />} />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}