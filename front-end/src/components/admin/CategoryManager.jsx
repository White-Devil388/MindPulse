import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CategoryManager() {
  const { categories, addExamToCategory, removeExamFromCategory } = useAdminData();
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'civil-services');
  const [newExamName, setNewExamName] = useState('');
  const [search, setSearch] = useState('');

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    addExamToCategory(activeCategory.id, newExamName);
    setNewExamName('');
  };

  const filteredCategories = categories.filter((c) =>
    c.name.en.toLowerCase().includes(search.toLowerCase()) ||
    c.exams.some((ex) => ex.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#111a33] p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Exam Categories & Streams</h2>
          <p className="text-xs text-slate-400">
            Manage exam segments (Civil Services, SSC, Banking, Railways, Defence, etc.) and their sub-exams
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category List Column */}
        <div className="bg-[#111a33] p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Categories ({categories.length})
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {categories.map((cat) => {
              const isSelected = cat.id === activeCategory.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: `${cat.color}33`, color: cat.color }}
                    >
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{cat.name.en}</div>
                      <div className="text-[10px] text-slate-400">{cat.name.hi}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {cat.exams.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Details & Exams manager */}
        <div className="lg:col-span-2 bg-[#111a33] p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{activeCategory.name.en}</h3>
                <span className="text-xs text-slate-400 font-medium">({activeCategory.name.hi})</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeCategory.desc.en}</p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {activeCategory.exams.length} Exams Listed
              </span>
            </div>
          </div>

          {/* Add Exam to this Category form */}
          <form onSubmit={handleAddExam} className="flex gap-2">
            <input
              type="text"
              required
              placeholder={`Add new exam in ${activeCategory.name.en} (e.g. UPSC CSE 2026)`}
              value={newExamName}
              onChange={(e) => setNewExamName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </form>

          {/* Active exams chips */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Included Exams in this Category
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {activeCategory.exams.map((examName) => (
                <div
                  key={examName}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:border-cyan-400/30 transition-all group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-xs font-semibold text-white truncate">{examName}</span>
                  </div>

                  <button
                    onClick={() => removeExamFromCategory(activeCategory.id, examName)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                    title={`Remove ${examName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

