import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileQuestion,
  BookCheck,
  TrendingUp,
  LogOut,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle,
  Menu,
  ChevronRight,
  Sparkles,
  Eye,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MockTestManager from '../../components/admin/MockTestManager';
import QuestionBankManager from '../../components/admin/QuestionBankManager';
import CategoryManager from '../../components/admin/CategoryManager';
import AnnouncementManager from '../../components/admin/AnnouncementManager';
import AspirantManager from '../../components/admin/AspirantManager';
import JsonQuestionImporter from '../../components/admin/JsonQuestionImporter';
import SubmissionsManager from '../../components/admin/SubmissionsManager';
import api from '../../services/api';

export default function AdminDashboard() {
  const { adminUser, logout } = useAdminAuth();
  const { mockTests, questions, categories, aspirants } = useAdminData();
  const navigate = useNavigate();

  // Active side panel tab: 'dashboard' | 'mock-tests' | 'questions' | 'categories' | 'announcements' | 'aspirants'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liveAdminStats, setLiveAdminStats] = useState(null);

  // Fetch live admin statistics directly from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    api.getAdminStats().then((data) => {
      if (isMounted && data) {
        setLiveAdminStats(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const totalAttempts = mockTests.reduce((acc, curr) => acc + (curr.attemptsCount || 0), 0);

  const stats = [
    {
      label: 'Website Visitors (Today)',
      value: (liveAdminStats?.todayVisits || 0).toLocaleString(),
      change: `${(liveAdminStats?.totalVisits || 0).toLocaleString()} Total Hits`,
      icon: Eye,
      color: 'from-pink-500 to-rose-600',
      tab: 'dashboard',
    },
    {
      label: 'Student Leads & Users',
      value: (liveAdminStats?.totalUsers !== undefined ? liveAdminStats.totalUsers : aspirants.length).toLocaleString(),
      change: 'With Verified Phone/Email',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      tab: 'aspirants',
    },
    {
      label: 'Questions in Bank',
      value: (liveAdminStats?.totalQuestions !== undefined ? liveAdminStats.totalQuestions : questions.length).toLocaleString(),
      change: '10 Categories Active',
      icon: BookCheck,
      color: 'from-emerald-500 to-teal-600',
      tab: 'questions',
    },
    {
      label: 'Mock Tests Active',
      value: (liveAdminStats?.totalTests !== undefined ? liveAdminStats.totalTests : mockTests.length).toString(),
      change: 'All-India Test Series',
      icon: FileQuestion,
      color: 'from-cyan-500 to-blue-600',
      tab: 'mock-tests',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090e1d] text-slate-100 flex font-sans">
      {/* Side Panel Component */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        adminUser={adminUser}
      />

      {/* Main Panel Content Area (Offset by lg:ml-72 for sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Top Header Navbar */}
        <header className="h-16 bg-[#0c142b]/95 border-b border-white/10 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm font-bold text-white capitalize">
                {activeTab.replace('-', ' ')} Overview
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Live Traffic Tracking</span>
            </span>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
                A
              </div>
              <span className="text-xs font-medium text-slate-300 hidden md:inline">
                {adminUser?.email || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <>
              {/* Stat Cards 4-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTab(stat.tab)}
                      className="cursor-pointer bg-[#0e1630] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {stat.label}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-400 flex items-center gap-1">
                        <span className="text-emerald-400 font-bold">{stat.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions & Recent Tests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Test Series Quick View */}
                <div className="lg:col-span-2 bg-[#0e1630] rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <FileQuestion className="w-4 h-4 text-cyan-400" />
                      <span>Live Test Series in System</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('mock-tests')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      View All Tests
                    </button>
                  </div>

                  <div className="divide-y divide-white/5 text-xs">
                    {mockTests.slice(0, 5).map((test) => (
                      <div key={test.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white text-sm">{test.title}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {test.exam} • {test.totalQuestions} Questions • {test.duration} mins
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            {test.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Importer Quick Launch */}
                <div className="bg-[#0e1630] rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-base">Bulk Question Importer</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Upload hundreds of MCQs directly to MongoDB Atlas using clean JSON or CSV templates.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('importer')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    Open Bulk Importer
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Subpanel Components */}
          {activeTab === 'mock-tests' && <MockTestManager />}
          {activeTab === 'questions' && <QuestionBankManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'announcements' && <AnnouncementManager />}
          {activeTab === 'aspirants' && <AspirantManager />}
          {activeTab === 'submissions' && <SubmissionsManager />}
          {(activeTab === 'importer' || activeTab === 'import-json') && <JsonQuestionImporter />}
        </main>
      </div>
    </div>
  );
}
