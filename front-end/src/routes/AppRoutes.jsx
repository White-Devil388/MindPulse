import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingFallback from '../components/common/LoadingFallback';
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute';

// Lazy-loaded pages for optimized bundle splitting & faster first contentful paint
const Home = lazy(() => import('../pages/Home'));
const Exams = lazy(() => import('../pages/Exams'));
const ExamDetail = lazy(() => import('../pages/ExamDetail'));
const MockTestAttempt = lazy(() => import('../pages/MockTestAttempt'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// Lazy-loaded Admin pages
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback message="Loading MindPulse..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:categoryId" element={<Exams />} />
        <Route path="/exams/:categoryId/:examId" element={<ExamDetail />} />
        <Route path="/mock-tests" element={<Exams />} />
        <Route path="/mock-test/:testId" element={<MockTestAttempt />} />
        <Route path="/pyq" element={<Exams />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin URL-only routes (No navbar links) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
