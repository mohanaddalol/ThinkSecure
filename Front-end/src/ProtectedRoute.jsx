import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element: Component }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    // Redirect to home page, where login modal will open
    return <Navigate to="/" replace />;
  }

  return Component;
}

export default ProtectedRoute;
