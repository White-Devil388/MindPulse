import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Clock,
  FileCheck2,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { EXAM_CATEGORIES } from '../utils/examData';
import { COMPREHENSIVE_QUESTION_BANK } from '../utils/comprehensiveQuestions';
import { usePagination } from '../hooks/usePagination';
import api from '../services/api';

const QUESTIONS_PER_BATCH = 50;
const TESTS_PAGE_SIZE = 6;

export default function ExamDetail() {
  const { categoryId, examId } = useParams();
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [backendDetail, setBackendDetail] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getExamDetail(examId).then((data) => {
      if (isMounted && data) {
        setBackendDetail(data);
      }
    });
    return () => { isMounted = false; };
  }, [examId]);

  const currentCategory = useMemo(() => {
    return EXAM_CATEGORIES.find((c) => c.id === categoryId) || EXAM_CATEGORIES[0];
  }, [categoryId]);

  const examTitle = useMemo(() => {
    return (examId || '').replace(/-/g, ' ').toUpperCase();
  }, [examId]);

  // useMemo: compute matching questions once per exam change
  const matchingQuestions = useMemo(() => {
    let allQuestions = [];
    try {
      const saved = localStorage.getItem('mindpulse_admin_questions');
      if (saved) {
        allQuestions = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    if (!allQuestions || allQuestions.length === 0) {
      allQuestions = COMPREHENSIVE_QUESTION_BANK;
    }

    const cleanId = (examId || '').toLowerCase();
    const cleanCat = (categoryId || '').toLowerCase();

    let filtered = allQuestions.filter((q) => {
      const qCat = (q.category || '').toLowerCase();
      const qExam = (q.exam || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const qExamRaw = (q.exam || '').toLowerCase();
      return (
        cleanId.includes(qExam) ||
        cleanId.includes(qExamRaw) ||
        qExam.includes(cleanId) ||
        qCat === cleanCat
      );
    });

    return filtered.length > 0 ? filtered : allQuestions;
  }, [examId, categoryId]);

  const totalBatches = useMemo(() => {
    return Math.max(1, Math.ceil(matchingQuestions.length / QUESTIONS_PER_BATCH));
  }, [matchingQuestions.length]);

  // Generate batch index array: [1, 2, 3, ... totalBatches]
  const batchesArray = useMemo(() => {
    return Array.from({ length: totalBatches }, (_, i) => i + 1);
  }, [totalBatches]);

  // Pagination hook for mock tests
  const {
    currentPage: currentTestPage,
    totalPages: totalTestPages,
    paginatedItems: paginatedBatches,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(batchesArray, TESTS_PAGE_SIZE);

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'mock-tests', label: `Mock Tests (${totalBatches} Full Tests)` },
    { id: 'subjects', label: 'Subjects & Topics' },
    { id: 'pyq', label: 'Previous Year Papers' },
    { id: 'syllabus', label: 'Syllabus & Pattern' },
  ], [totalBatches]);

  const handleTabChange = useCallback((id) => {
    setActiveTab(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Banner */}
      <div className="bg-hero-gradient pb-12">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 text-white">
          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white mb-4 bg-white/10 px-3 py-1 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Exams</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-400 text-blue-950 mb-2">
                {currentCategory.name.en}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {examTitle} Free Practice & Mock Tests
              </h1>
              <p className="mt-2 text-sm text-blue-100 max-w-2xl">
                Attempt {totalBatches} full-length TCS-iON pattern tests with 50 questions each. Complete solutions, Hindi/English bilingual mode, and all-India percentile ranking.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/mock-test/${examId}?batch=1`}
                className="px-6 py-3 rounded-2xl bg-white text-blue-900 hover:bg-cyan-50 font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current text-blue-600" />
                <span>Start Test 1</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900 shadow-md font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {activeTab === 'overview' || activeTab === 'mock-tests' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Mock Test Series with Pagination */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E2A5A] flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-blue-600" />
                      <span>Full-Length 50-Question Test Series</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing page {currentTestPage} of {totalTestPages} ({totalBatches} total tests available)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedBatches.map((batchNum) => {
                    const startQ = (batchNum - 1) * QUESTIONS_PER_BATCH + 1;
                    const endQ = Math.min(batchNum * QUESTIONS_PER_BATCH, matchingQuestions.length);
                    const countInThis = endQ - startQ + 1;

                    return (
                      <div
                        key={batchNum}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group bg-slate-50/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-900 group-hover:text-blue-600">
                              {examTitle} Test {batchNum}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Free
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {countInThis} Qs • 60 Mins • 100 Marks (Qs {startQ}–{endQ})
                          </div>
                        </div>

                        <Link
                          to={`/mock-test/${examId}?batch=${batchNum}`}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                        >
                          <span>Start</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalTestPages > 1 && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={prevPage}
                      disabled={!hasPrevPage}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalTestPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            currentTestPage === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={!hasNextPage}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Pattern Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <h3 className="text-lg font-bold text-[#1E2A5A] mb-4">Exam Pattern & Format</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="pb-3">Stage / Section</th>
                        <th className="pb-3">Questions</th>
                        <th className="pb-3">Marks</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Negative Marking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-3 font-semibold">General Studies & Awareness</td>
                        <td className="py-3">50</td>
                        <td className="py-3">100</td>
                        <td className="py-3">60 Mins</td>
                        <td className="py-3 text-red-500 font-medium">-0.50 Marks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Highlights */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-[#1E2A5A] text-base">Key Highlights</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real TCS-iON timed test simulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Exact 50-Question Batches (Test 1, Test 2...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant percentile & weak chapter report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>100% Free - No paid barrier forever</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center">
            <h3 className="text-lg font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h3>
            <p className="text-xs text-slate-500 mt-2">
              Syllabus updates and solved previous papers are being populated directly from the backend.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
