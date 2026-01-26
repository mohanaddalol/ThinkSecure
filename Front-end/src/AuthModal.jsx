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

  const switchTo = (t) => {
    setErr("");
    setTab(t);
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
      await apiPost("/api/register", { email, username, password });
      const lData = await apiPost("/api/login", { email, password });
      onAuth({ token: lData.token, user: lData.user });
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
      onAuth({ token: data.token, user: data.user });
      onClose();
    } catch (e) {
      setErr(e.message || "Network error, try again.");
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
            {err && <p style={{ color: "red" }}>{err}</p>}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="button" onClick={handleSignupThenAutoLogin} disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
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
            {err && <p style={{ color: "red" }}>{err}</p>}

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
          </>
        )}
      </div>
    </div>
  );
}
