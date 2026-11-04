import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedUserRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('mindpulse_token');
  const userStr = localStorage.getItem('examprep_user');

  let validUser = false;
  try {
    if (userStr) {
      const parsed = JSON.parse(userStr);
      // Valid user must have an actual email and must not be empty
      if (parsed && parsed.email && parsed.email.trim() !== '' && parsed.email !== 'aspirant@examprep.in') {
        validUser = true;
      }
    }
  } catch (e) {
    validUser = false;
  }

  // If no valid auth token AND no valid signed-in user session, strictly redirect to /login
  if (!token && !validUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

