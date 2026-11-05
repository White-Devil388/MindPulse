import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Flag,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPREHENSIVE_QUESTION_BANK } from '../utils/comprehensiveQuestions';
import { getQuestionsForExam } from '../utils/questionFilter';
import { useTimer } from '../hooks/useTimer';
import api from '../services/api';

const QUESTIONS_PER_BATCH = 50;

export default function MockTestAttempt() {
  const { testId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse batch number from query param ?batch=1 or testId suffix
  const queryBatch = parseInt(searchParams.get('batch') || '1', 10);
  const currentBatchNum = isNaN(queryBatch) || queryBatch < 1 ? 1 : queryBatch;

  // Question container ref for smooth auto-scroll to top on question change
  const questionContainerRef = useRef(null);

  // useMemo: Load and filter questions matching exam/category once
  const poolQuestions = useMemo(() => {
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

    return getQuestionsForExam(allQuestions, testId, null);
  }, [testId]);

  // Calculate total batches of 50 questions each
  const totalBatches = useMemo(() => {
    return Math.max(1, Math.ceil(poolQuestions.length / QUESTIONS_PER_BATCH));
  }, [poolQuestions.length]);

  const activeBatch = Math.min(currentBatchNum, totalBatches);

  // Extract exactly the 50 questions for this batch
  const startIndex = (activeBatch - 1) * QUESTIONS_PER_BATCH;
  const questionsList = useMemo(() => {
    return poolQuestions.slice(startIndex, startIndex + QUESTIONS_PER_BATCH);
  }, [poolQuestions, startIndex]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Auto-submit callback using useCallback
  const handleAutoSubmit = useCallback(() => {
    if (!submitted) {
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [submitted]);

  // Accurate countdown timer custom hook (avoids tab drift)
  const { formattedTime, resetTimer, pauseTimer, timeLeft } = useTimer(3600, handleAutoSubmit);

  // Prevent accidental navigation, browser back button, reload or tab close while test is in progress
  useEffect(() => {
    if (submitted) return;

    // 1. Trap browser back / forward navigation
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      // Force user to stay on test attempt page
      window.history.pushState(null, '', window.location.href);
      if (
        window.confirm(
          '⚠️ Exam in Progress! You cannot use the browser back button.\n\nDo you want to CANCEL this exam and exit? Your progress will be lost.'
        )
      ) {
        navigate('/exams', { replace: true });
      }
    };

    // 2. Trap page refresh / tab close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'An exam is currently in progress. If you leave, your attempt will be cancelled.';
      return e.returnValue;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [submitted, navigate]);

  const handleCancelExam = useCallback(() => {
    if (
      window.confirm(
        '⚠️ Are you sure you want to CANCEL this examination?\n\nAll your answered questions will be discarded, and you will return to the exams catalog.'
      )
    ) {
      pauseTimer();
      navigate('/exams', { replace: true });
    }
  }, [navigate, pauseTimer]);

  // Reset attempt state if user switches batch
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setSubmitted(false);
    resetTimer(3600);
  }, [activeBatch, testId, resetTimer]);

  const handleSelectOption = useCallback((optIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  }, [submitted, currentIdx]);

  const toggleReview = useCallback(() => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx],
    }));
  }, [currentIdx]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    pauseTimer();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Record and evaluate attempt in backend MongoDB Atlas
    api.submitAttempt({
      testSlug: testId,
      answers: selectedAnswers,
      timeSpentSeconds: 3600 - timeLeft,
      questions: questionsList.map((q) => ({
        _id: q.id,
        correct: q.correctOption,
      })),
    });
  }, [testId, selectedAnswers, timeLeft, questionsList, pauseTimer]);

  const goToQuestion = useCallback((idx) => {
    setCurrentIdx(idx);
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const currentQ = useMemo(() => {
    return questionsList[currentIdx] || questionsList[0];
  }, [questionsList, currentIdx]);

  // Calculate score via useMemo to avoid recomputations on timer ticks
  const { correctCount, wrongCount, totalScore } = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    questionsList.forEach((q, idx) => {
      if (selectedAnswers[idx] !== undefined) {
        if (selectedAnswers[idx] === q.correctOption) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    const score = (correct * 2 - wrong * 0.5).toFixed(2);
    return { correctCount: correct, wrongCount: wrong, totalScore: score };
  }, [questionsList, selectedAnswers]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none font-sans" ref={questionContainerRef}>
      {/* Top Test Header (TCS-iON clean examination style) */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-tight">
                {testId?.replace(/-/g, ' ') || 'EXAM TEST'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                Test {activeBatch}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              50 Questions Batch ({startIndex + 1} to {startIndex + questionsList.length} of {poolQuestions.length} total) • 100 Marks
            </span>
          </div>
        </div>

        {/* Center: Real-time countdown timer */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-blue-700 font-mono font-bold text-xs sm:text-sm shadow-inner">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>{formattedTime}</span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700"
          >
            {paletteOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {!submitted ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelExam}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                Cancel Exam
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to submit Test ' + activeBatch + '?')) {
                    handleSubmit();
                  }
                }}
                className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/exams')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Exit Review
            </button>
          )}
        </div>
      </header>

      {/* Batch Navigation Banner if more than 50 questions exist */}
      {totalBatches > 1 && (
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Select Test Batch (50 Qs Each):</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {Array.from({ length: totalBatches }, (_, i) => i + 1).map((batchNum) => {
                const isSelected = activeBatch === batchNum;
                return (
                  <button
                    key={batchNum}
                    onClick={() => {
                      if (!submitted && Object.keys(selectedAnswers).length > 0) {
                        if (!confirm('Switching to another test will reset your current unsubmitted test answers. Proceed?')) {
                          return;
                        }
                      }
                      setSearchParams({ batch: batchNum.toString() });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    Test {batchNum} ({QUESTIONS_PER_BATCH} Qs)
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Attempt Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Area */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              {/* Question Meta Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 text-sm">
                    Question {currentIdx + 1} of {questionsList.length}
                  </span>
                  {currentQ?.exam && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      {currentQ.exam} • {currentQ.subject}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">+2.00</span>
                  <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">-0.50</span>
                </div>
              </div>

              {/* Question Statement */}
              <div className="py-6">
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {currentQ?.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ?.options?.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  const isCorrect = currentQ.correctOption === optIdx;

                  let optClass = 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 hover:bg-slate-50';

                  if (isSelected) {
                    optClass = 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm';
                  }

                  if (submitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-red-50 border-red-500 text-red-900 line-through';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm font-medium">{opt}</span>
                      </div>

                      {submitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation after submit */}
              {submitted && currentQ?.explanation && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Verified Solution:</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={submitted}
                  onClick={toggleReview}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    markedForReview[currentIdx]
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark for Review</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => goToQuestion(currentIdx - 1)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Previous
                </button>
                <button
                  disabled={currentIdx === questionsList.length - 1}
                  onClick={() => goToQuestion(currentIdx + 1)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Score Summary */}
        <div className="lg:col-span-4 space-y-4">
          {submitted ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-[#1E2A5A] text-base">Test Result Summary</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <div className="text-xl font-bold">{correctCount}</div>
                  <div>Correct</div>
                </div>
                <div className="p-3 bg-red-50 text-red-700 rounded-xl">
                  <div className="text-xl font-bold">{wrongCount}</div>
                  <div>Wrong</div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <div className="text-xl font-bold">{totalScore}</div>
                  <div>Score</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Question Palette */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1E2A5A] text-sm">Question Palette ({questionsList.length} Qs)</h3>
            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-1.5 -m-1.5">
              {questionsList.map((_, idx) => {
                const isCurrent = currentIdx === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isMarked = markedForReview[idx];

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                if (isAnswered) btnClass = 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700';
                if (isMarked) btnClass = 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600';
                if (isCurrent) btnClass += ' ring-2 ring-blue-500 ring-offset-1 z-10';

                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl font-bold text-xs border flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
