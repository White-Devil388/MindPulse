import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Eye,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function MockTestManager() {
  const { mockTests, categories, addMockTest, deleteMockTest, toggleTestStatus } = useAdminData();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('civil-services');
  const [exam, setExam] = useState('UPSC');
  const [duration, setDuration] = useState('60');
  const [totalQuestions, setTotalQuestions] = useState('50');
  const [totalMarks, setTotalMarks] = useState('100');
  const [difficulty, setDifficulty] = useState('Moderate');

  const selectedCategoryObj = categories.find((c) => c.id === category) || categories[0];

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMockTest({
      title: title.trim(),
      category,
      exam,
      duration: Number(duration),
      totalQuestions: Number(totalQuestions),
      totalMarks: Number(totalMarks),
      difficulty,
      status: 'Published',
    });

    setTitle('');
    setShowAddModal(false);
  };

  const filteredTests = mockTests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(search.toLowerCase()) ||
      test.exam.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111a33] p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-xl font-extrabold text-white">Mock Tests Management</h2>
          <p className="text-xs text-slate-400">
            Create, publish, edit, or remove mock test series for competitive exams
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Mock Test</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search test name or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.en}
            </option>
          ))}
        </select>
      </div>

      {/* Test List Table / Cards */}
      <div className="bg-[#111a33] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-3 px-4">Test Title & Exam</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration & Qs</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No mock tests match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{test.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                          {test.exam}
                        </span>
                        <span className="text-[10px] text-slate-400">Added: {test.dateAdded}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">
                      {test.category.replace('-', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {test.duration}m
                        </span>
                        <span>•</span>
                        <span>{test.totalQuestions} Qs</span>
                        <span>•</span>
                        <span>{test.totalMarks} Marks</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      {test.attemptsCount.toLocaleString()} attempts
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleTestStatus(test.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                          test.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        ● {test.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                            deleteMockTest(test.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111a33] border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <span>Create New Mock Test</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Test Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSC CGL 2026 Tier-1 Mock #5"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exam Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const cat = categories.find((c) => c.id === e.target.value);
                      if (cat && cat.exams.length > 0) setExam(cat.exams[0]);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Exam
                  </label>
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  >
                    {selectedCategoryObj?.exams?.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Moderate', 'Advanced'].map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Publish Mock Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

