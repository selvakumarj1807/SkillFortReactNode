import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  // If no token, redirect to login
  if (!adminToken) {
    return <Navigate to="/adminSignin" replace />;
  }

  // Else, render the protected component
  return children;
};

export default ProtectedRoute;
