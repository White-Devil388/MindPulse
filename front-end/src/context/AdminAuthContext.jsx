import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('mindpulse_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('mindpulse_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Seed credentials: email === 'admin' and password === 'admin123'
    // Also accepting 'admin@mindpulse.com' or standard 'admin'
    const trimmedEmail = email.trim().toLowerCase();
    if ((trimmedEmail === 'admin' || trimmedEmail === 'admin@mindpulse.com') && password === 'admin123') {
      const user = { email: trimmedEmail, role: 'admin', name: 'Super Admin' };
      localStorage.setItem('mindpulse_admin_auth', 'true');
      localStorage.setItem('mindpulse_admin_user', JSON.stringify(user));
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please use seed email: admin and password: admin123' };
  };

  const logout = () => {
    localStorage.removeItem('mindpulse_admin_auth');
    localStorage.removeItem('mindpulse_admin_user');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminUser, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

