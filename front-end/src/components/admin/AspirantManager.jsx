import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, Target, Calendar, UserCheck, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import api from '../../services/api';

export default function AspirantManager() {
  const { aspirants } = useAdminData();
  const [search, setSearch] = useState('');
  const [liveLeads, setLiveLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch registered user leads directly from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    api.getAdminAspirants().then((data) => {
      if (isMounted) {
        if (data && Array.isArray(data)) {
          setLiveLeads(data);
        } else {
          setLiveLeads([]);
        }
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const filtered = liveLeads.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (Array.isArray(u.targetExams) ? u.targetExams.join(' ') : u.targetExam || '').toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = 'Name,Email,Phone,Target Exams,Provider,Joined Date\n';
    const rows = filtered
      .map((u) =>
        `"${u.name || ''}","${u.email || ''}","${u.phone || 'N/A'}","${Array.isArray(u.targetExams) ? u.targetExams.join('; ') : u.targetExam || 'General'}","${u.provider || 'email'}","${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindpulse_student_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111a33] p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Leads & Admissions</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Student Leads & Registered Aspirants</h2>
          <p className="text-xs text-slate-400">
            Real-time candidate registrations with phone number, email, and target exams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-bold px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            Total Leads: {liveLeads.length}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads by candidate name, phone number, email, or target exam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-[#111a33] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-3 px-4">Candidate Lead</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Target Exam(s)</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No student leads found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => {
                  const targetList = Array.isArray(user.targetExams)
                    ? user.targetExams
                    : [user.targetExam || 'UPSC / SSC'];

                  return (
                    <tr key={user._id || user.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                            {(user.name || user.email || 'A')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.name || user.email.split('@')[0]}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number Lead */}
                      <td className="py-3.5 px-4">
                        {user.phone ? (
                          <a
                            href={`tel:${user.phone}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs hover:bg-emerald-500/20 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{user.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Not provided</span>
                        )}
                      </td>

                      {/* Target Exam */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {targetList.map((exam, eIdx) => (
                            <span
                              key={eIdx}
                              className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold text-[10px]"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Provider */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-400 text-[11px] bg-white/5 px-2 py-0.5 rounded">
                          {user.provider || 'email'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active Lead</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
