import React, { useState, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  HelpCircle,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 25;

export default function QuestionBankManager() {
  const { questions, categories, addQuestion, deleteQuestion, resetToComprehensiveBank } = useAdminData();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('civil-services');
  const [exam, setExam] = useState('UPSC');
  const [subject, setSubject] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOption, setCorrectOption] = useState(0);
  const [explanation, setExplanation] = useState('');

  const selectedCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === category) || categories[0];
  }, [categories, category]);

  const handleAddQuestion = useCallback((e) => {
    e.preventDefault();
    if (!questionText.trim() || !opt0 || !opt1 || !opt2 || !opt3) return;

    addQuestion({
      category,
      exam,
      subject: subject || 'General Knowledge',
      question: questionText.trim(),
      options: [opt0, opt1, opt2, opt3],
      correctOption: Number(correctOption),
      explanation: explanation.trim() || 'Correct answer as per official syllabus.',
      difficulty: 'Medium',
    });

    setQuestionText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setShowAddModal(false);
  }, [addQuestion, category, exam, subject, questionText, opt0, opt1, opt2, opt3, correctOption, explanation]);

  // useMemo: Filter questions to prevent heavy re-calculation on every keystroke
  const filteredQuestions = useMemo(() => {
    const qTerm = debouncedSearch.toLowerCase().trim();

    return questions.filter((q) => {
      const matchesSearch =
        !qTerm ||
        q.question.toLowerCase().includes(qTerm) ||
        q.subject?.toLowerCase().includes(qTerm) ||
        q.exam?.toLowerCase().includes(qTerm);
      const matchesExam = selectedExam === 'all' || q.exam === selectedExam;
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      return matchesSearch && matchesExam && matchesCategory;
    });
  }, [questions, debouncedSearch, selectedExam, selectedCategory]);

  // usePagination custom hook for managing 2200+ questions table
  const {
    currentPage: page,
    totalPages,
    paginatedItems: paginatedQuestions,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredQuestions, ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111a33] p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-xl font-extrabold text-white">Central Question Bank</h2>
          <p className="text-xs text-slate-400">
            Create, view, and organize questions with detailed explanations for all test papers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Load all pre-filled questions across all 10 exam categories?')) {
                resetToComprehensiveBank();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reload official multi-exam bank"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload All Categories</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by text or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        >
          <option value="all">All Streams ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.en}
            </option>
          ))}
        </select>

        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#111a33] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        >
          <option value="all">All Exams Filter</option>
          {categories
            .flatMap((c) => c.exams)
            .map((examName) => (
              <option key={examName} value={examName}>
                {examName}
              </option>
            ))}
        </select>
      </div>

      {/* Question List Cards */}
      <div className="space-y-4">
        {paginatedQuestions.length === 0 ? (
          <div className="text-center py-16 bg-[#111a33] rounded-2xl border border-white/10">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search term.</p>
          </div>
        ) : (
          paginatedQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="bg-[#111a33] p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold text-[10px] border border-cyan-500/20">
                    {q.exam}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-medium text-[10px] border border-blue-500/20">
                    {q.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-[10px]">
                    {q.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Delete this question permanently?')) {
                      deleteQuestion(q.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Question Body */}
              <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctOption;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                        isCorrect
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                          : 'bg-white/[0.02] border-white/5 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isCorrect ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Note */}
              {q.explanation && (
                <div className="text-[11px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300 mr-1.5">Explanation:</span>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-[#111a33] rounded-2xl border border-white/10 text-xs">
          <div className="text-slate-400">
            Showing <span className="text-white font-bold">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="text-white font-bold">{Math.min(page * ITEMS_PER_PAGE, filteredQuestions.length)}</span> of{' '}
            <span className="text-cyan-300 font-bold">{filteredQuestions.length.toLocaleString()}</span> questions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111a33] border border-white/20 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Add Question to Question Bank</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
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
                    Exam
                  </label>
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400"
                  >
                    {selectedCategoryObj?.exams.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern History"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Statement
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the full question text here..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-500"
                />
              </div>

              {/* Options Inputs */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Options & Select Correct Answer
                </label>
                {[
                  { val: opt0, set: setOpt0, label: 'Option A', idx: 0 },
                  { val: opt1, set: setOpt1, label: 'Option B', idx: 1 },
                  { val: opt2, set: setOpt2, label: 'Option C', idx: 2 },
                  { val: opt3, set: setOpt3, label: 'Option D', idx: 3 },
                ].map((optItem) => (
                  <div key={optItem.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={Number(correctOption) === optItem.idx}
                      onChange={() => setCorrectOption(optItem.idx)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      placeholder={optItem.label}
                      value={optItem.val}
                      onChange={(e) => optItem.set(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the option is correct..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1328] border border-white/10 text-white text-xs focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-blue-950 font-bold text-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
