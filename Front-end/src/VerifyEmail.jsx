import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "./api";
import "./VerifyEmail.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    // Verify email
    fetch(`${API_URL}/api/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.verified) {
          setStatus("success");
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className={`verify-icon ${status}`}>
          {status === "verifying" && <div className="spinner"></div>}
          {status === "success" && "✓"}
          {status === "error" && "✕"}
        </div>
        
        <h2>{status === "success" ? "Email Verified!" : status === "error" ? "Verification Failed" : "Verifying..."}</h2>
        <p>{message}</p>
        
        {status === "success" && (
          <p className="redirect-text">Redirecting to login...</p>
        )}
        
        {status === "error" && (
          <button onClick={() => navigate("/")} className="back-btn">
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}
