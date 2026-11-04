import React from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  FolderTree,
  Bell,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
  ExternalLink,
  FileCode
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  adminUser
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Overview & Metrics',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'mock-tests',
      label: 'Manage Mock Tests',
      icon: FileQuestion,
      badge: 'Live',
    },
    {
      id: 'questions',
      label: 'Question Bank',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'import-json',
      label: 'Import Questions (JSON)',
      icon: FileCode,
      badge: 'New',
    },
    {
      id: 'categories',
      label: 'Exam Categories',
      icon: FolderTree,
      badge: null,
    },
    {
      id: 'announcements',
      label: 'Announcements & Alerts',
      icon: Bell,
      badge: null,
    },
    {
      id: 'aspirants',
      label: 'Student Leads & Users',
      icon: Users,
      badge: 'Live',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Side Panel Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c142b] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-cyan-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center">
                Mind<span className="text-cyan-400">Pulse</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                Content Manager
              </span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin profile snippet */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-[#131d3d] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {adminUser?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[11px] text-cyan-300 font-medium truncate">
              {adminUser?.email || 'admin'}
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-5 overflow-y-auto space-y-1.5 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Content Controls
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4" />
              <span>Preview Live Site</span>
            </div>
            <span className="text-[10px] text-slate-500">New tab</span>
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

