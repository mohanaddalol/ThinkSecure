import React, { useState } from "react";
import { API_URL, apiPost } from "./api";

// ✅ Frontend validation functions (these match backend validation)
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  const asciiRegex = /^[\x20-\x7E]+$/;
  if (!asciiRegex.test(password)) {
    return { valid: false, message: "Password must contain only English letters, numbers, and symbols" };
  }
  return { valid: true };
};

export default function AuthModal({ onClose, onAuth, defaultTab = "signup" }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const switchTo = (t) => {
    setErr("");
    setTab(t);
    setShowForgotPassword(false);
    setResetEmailSent(false);
  };

  const handleSignupThenAutoLogin = async () => {
    // ✅ Frontend validation before sending to backend
    if (!email || !username || !password) {
      setErr("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setErr("Please enter a valid email address (e.g., name@gmail.com)");
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setErr(passwordCheck.message);
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const data = await apiPost("/api/signup", { email, username, password });
      onAuth({ token: data.token, user: data.user });
      onClose();
    } catch (e) {
      setErr(e.message || "Network error, try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // ✅ Frontend validation before sending to backend
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setErr("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setErr("Invalid credentials");
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const data = await apiPost("/api/login", { email, password });

    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErr("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setErr("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const data = await apiPost("/api/forgot-password", { email });
      setResetEmailSent(true);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to send reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabBtn = (active) => ({
    flex: 1,
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #fa7e0b",
    background: active ? "#fa7e0b" : "#fff",
    color: active ? "#fff" : "#fa7e0b",
    fontWeight: 700,
    cursor: "pointer",
  });

  // ✅ Google OAuth login handler
  const handleGoogleLogin = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "https://thinksecure.onrender.com";
    window.location.href = `${backendURL}/api/auth/google`;
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => switchTo("signup")} style={tabBtn(tab === "signup")}>
            Sign Up
          </button>
          <button type="button" onClick={() => switchTo("login")} style={tabBtn(tab === "login")}>
            Login
          </button>
        </div>

        {tab === "signup" ? (
          <>
            <h2>Create your account</h2>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {err && (
              <div style={{
                color: "#dc3545",
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "10px",
                fontSize: "14px"
              }}>
                ⚠️ {err}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="button" onClick={handleSignupThenAutoLogin} disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>

            {/* ✅ Google Sign Up Button */}
            <div style={{ margin: "20px 0", textAlign: "center", position: "relative" }}>
              <div style={{
                borderTop: "1px solid #ddd",
                position: "relative",
                margin: "10px 0"
              }}>
                <span style={{
                  background: "#fff",
                  padding: "0 10px",
                  position: "relative",
                  top: "-12px",
                  color: "#666",
                  fontSize: "14px"
                }}>
                  OR
                </span>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  background: "#fff",
                  color: "#333",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "#f5f5f5"}
                onMouseLeave={(e) => e.target.style.background = "#fff"}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </>
        ) : showForgotPassword ? (
          <>
            <h2>Forgot Password</h2>
            {resetEmailSent ? (
              <div style={{
                color: "#28a745",
                background: "#d4edda",
                border: "1px solid #c3e6cb",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "14px"
              }}>
                ✅ If an account exists with this email, you will receive a password reset link shortly. Please check your email.
              </div>
            ) : (
              <>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {err && (
                  <div style={{
                    color: "#dc3545",
                    background: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    padding: "12px",
                    borderRadius: "6px",
                    marginTop: "10px",
                    fontSize: "14px"
                  }}>
                    ⚠️ {err}
                  </div>
                )}
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                  setErr("");
                }}
                style={{ background: "#fff", color: "#fa7e0b", border: "1px solid #fa7e0b" }}
              >
                Back to Login
              </button>
              {!resetEmailSent && (
                <button type="button" onClick={handleForgotPassword} disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div style={{ textAlign: "right", marginTop: "5px" }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>

            {err && (
              <div style={{
                color: "#dc3545",
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "10px",
                fontSize: "14px"
              }}>
                ⚠️ {err}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setTab("signup")}
                style={{ background: "#fff", color: "#fa7e0b", border: "1px solid #fa7e0b" }}
              >
                Create account
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="button" onClick={handleLogin} disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>

            {/* ✅ Google Login Button */}
            <div style={{ margin: "20px 0", textAlign: "center", position: "relative" }}>
              <div style={{
                borderTop: "1px solid #ddd",
                position: "relative",
                margin: "10px 0"
              }}>
                <span style={{
                  background: "#fff",
                  padding: "0 10px",
                  position: "relative",
                  top: "-12px",
                  color: "#666",
                  fontSize: "14px"
                }}>
                  OR
                </span>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  background: "#fff",
                  color: "#333",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "#f5f5f5"}
                onMouseLeave={(e) => e.target.style.background = "#fff"}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
