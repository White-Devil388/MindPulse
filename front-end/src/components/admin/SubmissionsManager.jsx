import React, { useState, useEffect } from 'react';
import { 
  FileQuestion, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  HelpCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdminData } from '../../context/AdminDataContext';
import { findCategoryForExam } from '../../utils/questionFilter';

export default function SubmissionsManager() {
  const { addQuestion } = useAdminData();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const data = await api.getAdminSubmissions();
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setActionNotice(null);
    const res = await api.updateSubmissionStatus(id, newStatus);
    if (res && res.success) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status: newStatus } : sub))
      );

      // If approved, automatically add this question to the active Question Bank so students can practice it
      if (newStatus === 'approved') {
        const sub = submissions.find((s) => s._id === id);
        if (sub) {
          // Parse correct option index (e.g. "Option A: ..." -> 0)
          let correctOption = 0;
          if (typeof sub.correctAnswer === 'string') {
            const match = sub.correctAnswer.match(/Option\s+([A-D])/i);
            if (match) {
              correctOption = match[1].toUpperCase().charCodeAt(0) - 65;
            } else if (sub.options && sub.options.length > 0) {
              const idx = sub.options.findIndex((opt) => opt.trim() === sub.correctAnswer.trim());
              if (idx !== -1) correctOption = idx;
            }
          }

          const inferredCategory = findCategoryForExam(sub.exam) || 'civil-services';

          addQuestion({
            id: `contrib-${sub._id || Date.now()}`,
            category: inferredCategory,
            exam: sub.exam,
            subject: sub.subject,
            topic: sub.topic || 'General',
            question: sub.questionText,
            options: sub.options || [],
            correctOption: correctOption >= 0 && correctOption < (sub.options?.length || 4) ? correctOption : 0,
            explanation: sub.explanation || `Contributed by verified educator ${sub.contributorName}.`,
            difficulty: 'Medium',
          });

          setActionNotice({
            type: 'success',
            text: `Question approved! It has been published live to the "${sub.exam}" Question Bank.`,
          });
        }
      } else if (newStatus === 'rejected') {
        setActionNotice({
          type: 'info',
          text: 'Question has been marked as rejected and will not be published.',
        });
      }
    }
    setUpdatingId(null);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contributorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.exam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-cyan-400" />
            Community Submitted Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Questions contributed by users from the About Us page awaiting Shubham Mishra's review.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Submissions
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold border transition-all ${
            actionNotice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}
        >
          <span>{actionNotice.text}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions, contributor name, exam or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Status ({submissions.length})</option>
            <option value="pending">Pending ({submissions.filter((s) => s.status === 'pending').length})</option>
            <option value="approved">Approved ({submissions.filter((s) => s.status === 'approved').length})</option>
            <option value="rejected">Rejected ({submissions.filter((s) => s.status === 'rejected').length})</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          Loading contributed questions...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-slate-500" />
          <p className="text-sm font-medium">No question submissions found</p>
          <p className="text-xs text-slate-500">
            When users submit new questions via the About Us page form, they will appear right here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub._id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {sub.exam}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {sub.subject}
                  </span>
                  {sub.topic && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                      {sub.topic}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      sub.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : sub.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {sub.status === 'approved' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : sub.status === 'rejected' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {sub.status}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {sub.questionText}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {sub.options?.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="font-bold text-cyan-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer & Explanation */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <div className="text-xs text-emerald-400 font-semibold">
                  Correct Answer: <span className="text-white font-normal">{sub.correctAnswer}</span>
                </div>
                {sub.explanation && (
                  <div className="text-xs text-slate-400">
                    Explanation: <span className="text-slate-300">{sub.explanation}</span>
                  </div>
                )}
              </div>

              {/* Contributor Footer & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    {sub.contributorName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {sub.contributorEmail}
                  </span>
                  {sub.contributorPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {sub.contributorPhone}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">
                    Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(sub._id, 'approved')}
                    disabled={updatingId === sub._id || sub.status === 'approved'}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(sub._id, 'rejected')}
                    disabled={updatingId === sub._id || sub.status === 'rejected'}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
