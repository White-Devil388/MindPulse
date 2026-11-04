import React, { useState } from 'react';
import { Bell, Plus, Trash2, Megaphone, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AnnouncementManager() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useAdminData();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Notification');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAnnouncement({
      title: title.trim(),
      type,
    });
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111a33] p-5 rounded-2xl border border-white/10">
        <h2 className="text-xl font-extrabold text-white">Announcements & Portal Notice Bar</h2>
        <p className="text-xs text-slate-400">
          Publish real-time banners, exam date updates, and breaking notifications for students
        </p>
      </div>

      {/* Add New Notice Form */}
      <div className="bg-[#111a33] p-5 rounded-2xl border border-white/10 shadow-lg">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-48">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
            >
              <option value="Notification">📢 Notification</option>
              <option value="Exam Alert">⚡ Exam Alert</option>
              <option value="New Feature">🚀 New Feature</option>
              <option value="Urgent">⚠️ Urgent Notice</option>
            </select>
          </div>

          <input
            type="text"
            required
            placeholder="Type announcement text (e.g. UPSC CSE 2026 notification released, 1200+ vacancies)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Alert</span>
          </button>
        </form>
      </div>

      {/* Announcements List */}
      <div className="bg-[#111a33] rounded-2xl border border-white/10 p-5 space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Active Student Alerts ({announcements.length})
        </div>

        {announcements.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">
            No active announcements.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 hover:border-cyan-400/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{ann.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {ann.type}
                    </span>
                    <span className="text-[10px] text-slate-400">Date: {ann.date}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">● Live</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteAnnouncement(ann.id)}
                className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Remove alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

