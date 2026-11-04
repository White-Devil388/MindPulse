import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('examprep_user') || '{"email":"aspirant@mindpulse.in","name":"Aspirant"}');
  const [stats, setStats] = useState({
    accuracy: 0,
    mcqsSolved: 0,
    timePracticedHours: 0,
    percentile: 0,
    streakDays: 0,
    weakTopics: [],
    recentAttempts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getUserStats().then((data) => {
      if (isMounted) {
        if (data) {
          setStats(data);
        }
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-hero-gradient pb-12">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-200 mb-1">
                <Flame className="w-4 h-4 text-orange-400 fill-current" />
                <span>{stats.streakDays > 0 ? `${stats.streakDays}-Day Practice Streak` : 'Start Your Daily Streak'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name || user.email.split('@')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Your target exams: UPSC CSE, SSC CGL 2026. Keep practicing daily to maintain accuracy!
              </p>
            </div>

            <Link
              to="/mock-test/ssc-cgl-daily-live"
              className="px-5 py-2.5 rounded-full bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-lg hover:bg-cyan-50 active:scale-95 transition-all"
            >
              Resume Today's Practice
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">{stats.accuracy}%</div>
              <div className="text-xs text-slate-400">Avg. Accuracy</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">{stats.mcqsSolved}</div>
              <div className="text-xs text-slate-400">MCQs Solved</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">{stats.timePracticedHours} hrs</div>
              <div className="text-xs text-slate-400">Time Practiced</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">{stats.percentile}%</div>
              <div className="text-xs text-slate-400">Overall Percentile</div>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weak Topics to Revise */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1E2A5A] text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Weak Topics Detected</span>
              </h3>
            </div>
            {stats.weakTopics && stats.weakTopics.length > 0 ? (
              <div className="space-y-3 text-xs">
                {stats.weakTopics.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-700">{item.topic}</div>
                      <div className="text-[11px] text-red-500 font-medium">{item.accuracy}% Accuracy</div>
                    </div>
                    <Link to="/exams" className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-blue-600 hover:bg-blue-50">
                      Practice
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No weak topics detected yet. Start attempting mock tests to see live topic analysis!
              </div>
            )}
          </div>

          {/* Recent Mock Tests */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1E2A5A] text-sm">Recent Test Attempts</h3>
              <Link to="/mock-tests" className="text-xs text-blue-600 font-semibold hover:underline">
                Attempt Mock Tests
              </Link>
            </div>

            {stats.recentAttempts && stats.recentAttempts.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {stats.recentAttempts.map((attempt, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{attempt.testTitle}</div>
                      <div className="text-slate-400 text-[11px]">{attempt.timeAgo} • {attempt.questionsCount} Questions</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-sm">{attempt.score}</span>
                      <div className="text-[10px] text-slate-400">{attempt.percentile}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-3">
                <p>You haven't attempted any mock tests yet.</p>
                <Link
                  to="/exams"
                  className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Start Your First Test Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

