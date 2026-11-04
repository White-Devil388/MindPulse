import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedUserRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('mindpulse_token');
  const user = localStorage.getItem('examprep_user');

  // If no auth token or user session exists, redirect to login page with return path
  if (!token && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
