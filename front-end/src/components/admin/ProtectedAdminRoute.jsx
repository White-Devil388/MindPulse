import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    // Redirect to /admin/login if trying to access protected admin pages
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
