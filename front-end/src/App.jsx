import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import api from './services/api';
import './i18n';

export default function App() {
  const location = useLocation();

  // Automatic silent visitor tracker: runs whenever a user visits or navigates pages
  useEffect(() => {
    // Exclude internal admin dashboard visits from public analytics
    if (!location.pathname.startsWith('/admin')) {
      api.trackVisit(location.pathname);
    }
  }, [location.pathname]);

  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <div className="w-full min-h-screen">
          <AppRoutes />
        </div>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}
