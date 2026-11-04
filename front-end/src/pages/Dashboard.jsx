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
  const user = JSON.parse(localStorage.getItem('examprep_user') || '{"email":"aspirant@examprep.in"}');
  const [stats, setStats] = useState({
    accuracy: 74.5,
    mcqsSolved: 840,
    timePracticedHours: 18.4,
    percentile: 91.2,
    streakDays: 5,
    weakTopics: [
      { topic: 'Indian Polity: Fundamental Rights', accuracy: 42 },
      { topic: 'Quantitative: Time & Distance', accuracy: 48 },
      { topic: 'General Science: Thermodynamics', accuracy: 51 },
    ],
    recentAttempts: [
      {
        testTitle: 'SSC CGL Tier 1 Mock Test 4',
        timeAgo: 'Completed yesterday',
        questionsCount: 100,
        score: '142.5 / 200',
        percentile: '92.4 Percentile',
      },
      {
        testTitle: 'UPSC CSE Prelims GS 1 Mock 2',
        timeAgo: 'Completed 3 days ago',
        questionsCount: 100,
        score: '108.0 / 200',
        percentile: '88.1 Percentile',
      },
    ],
  });

  useEffect(() => {
    let isMounted = true;
    api.getUserStats().then((data) => {
      if (isMounted && data) {
        setStats((prev) => ({ ...prev, ...data }));
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
                <span>5-Day Practice Streak</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.email.split('@')[0]}!
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
              <div className="text-2xl font-bold text-[#1E2A5A]">74.5%</div>
              <div className="text-xs text-slate-400">Avg. Accuracy</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">840</div>
              <div className="text-xs text-slate-400">MCQs Solved</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">18.4 hrs</div>
              <div className="text-xs text-slate-400">Time Practiced</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1E2A5A]">91.2%</div>
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
              <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700">Indian Polity: Fundamental Rights</div>
                  <div className="text-[11px] text-red-500 font-medium">42% Accuracy</div>
                </div>
                <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Practice
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700">Quantitative: Time & Distance</div>
                  <div className="text-[11px] text-red-500 font-medium">48% Accuracy</div>
                </div>
                <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Practice
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700">General Science: Thermodynamics</div>
                  <div className="text-[11px] text-red-500 font-medium">51% Accuracy</div>
                </div>
                <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Practice
                </button>
              </div>
            </div>
          </div>

          {/* Recent Mock Tests */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1E2A5A] text-sm">Recent Test Attempts</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">SSC CGL Tier 1 Mock Test 4</div>
                  <div className="text-slate-400 text-[11px]">Completed yesterday • 100 Questions</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 text-sm">142.5 / 200</span>
                  <div className="text-[10px] text-slate-400">92.4 Percentile</div>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">UPSC CSE Prelims GS 1 Mock 2</div>
                  <div className="text-slate-400 text-[11px]">Completed 3 days ago • 100 Questions</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600 text-sm">108.0 / 200</span>
                  <div className="text-[10px] text-slate-400">88.1 Percentile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

