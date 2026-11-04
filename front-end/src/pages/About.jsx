import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { 
  HeartHandshake, 
  Code, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Award,
  Globe2,
  BookOpenCheck,
  ShieldCheck,
  PlusCircle,
  Clock,
  Zap,
  Target,
  ArrowRight,
  Compass,
  Laptop
} from 'lucide-react';
import { api } from '../services/api';

export default function About() {
  const [formData, setFormData] = useState({
    contributorName: '',
    contributorEmail: '',
    contributorPhone: '',
    exam: '',
    subject: '',
    topic: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const payload = {
      contributorName: formData.contributorName,
      contributorEmail: formData.contributorEmail,
      contributorPhone: formData.contributorPhone,
      exam: formData.exam,
      subject: formData.subject,
      topic: formData.topic || 'General',
      questionText: formData.questionText,
      options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
      correctAnswer: `Option ${formData.correctAnswer}: ${formData[`option${formData.correctAnswer}`] || ''}`,
      explanation: formData.explanation,
    };

    const res = await api.submitCommunityQuestion(payload);
    setSubmitting(false);

    if (res && res.success) {
      setStatusMessage({
        type: 'success',
        text: '🎉 Thank you! Your question has been submitted successfully and sent directly to Shubham Mishra (Admin) for review!',
      });
      setFormData({
        contributorName: '',
        contributorEmail: '',
        contributorPhone: '',
        exam: '',
        subject: '',
        topic: '',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res?.message || 'Something went wrong while submitting. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - Styled with MindPulse signature Vibrant Blue & Cyan Gradient */}
        <section className="relative bg-hero-gradient pt-28 sm:pt-36 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
          {/* Animated Ambient Glow Orbs */}
          <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-32 right-10 w-96 h-96 bg-blue-700/35 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Subtle 3D Geometric Accents */}
          <div className="absolute top-24 left-1/4 w-4 h-4 bg-white/40 rotate-45 rounded-sm animate-bounce pointer-events-none duration-1000" />
          <div className="absolute bottom-24 right-1/4 w-6 h-6 border-2 border-cyan-300/60 rotate-12 rounded-sm pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 text-xs sm:text-sm font-semibold text-cyan-200 shadow-md backdrop-blur-md hover:scale-105 transition-transform duration-300 cursor-default">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Democratizing Education Across India</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.18] drop-shadow-md">
              Free Mock Test Practice <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-100 to-white">
                For Every Single Aspirant
              </span>
            </h1>

            {/* Subtext */}
            <p className="max-w-3xl mx-auto text-base sm:text-xl text-blue-100/90 leading-relaxed font-normal">
              MindPulse was founded with a single mission: To empower every student preparing for government exams with <strong>100% free, high-caliber, and real-time timed mock tests</strong> without financial obstacles.
            </p>
          </div>

          {/* Bottom Wave Transition to White/Light Section */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none translate-y-1">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-8 sm:h-12 object-fill"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C360,40 1080,40 1440,0 L1440,60 L0,60 Z"
                fill="#f8fafc"
              />
            </svg>
          </div>
        </section>

        {/* CONTENT CONTAINER */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-20 space-y-12 pb-24">
          
          {/* 1. LIFETIME FREE PLEDGE CARD (3D Shadow Floating Glassmorphism) */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-3d-float border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/50 to-blue-100/30 rounded-bl-full pointer-events-none -z-0" />
            <div className="relative z-10 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Official Promise
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-brand-soft px-3.5 py-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span>Verified 100% Free Forever</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                  Lifetime Free Access — No Hidden Fees, No Subscriptions Ever!
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Every mock test, chapter-wise question bank, performance analysis, and previous year question paper (PYQ) on MindPulse will <strong>remain permanently free</strong> for every student across India. No paywalls, no credit cards required, and no locked tests after trials.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/40 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">88+ Target Exams</h4>
                  <p className="text-xs text-slate-500 mt-1">UPSC, SSC CGL, Banking, Railway, Defence & State PSCs.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Timed Realistic Interface</h4>
                  <p className="text-xs text-slate-500 mt-1">Exact exam patterns, timer pressure, and negative marking.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Bilingual English & Hindi</h4>
                  <p className="text-xs text-slate-500 mt-1">Switch languages smoothly on any question and solution.</p>
                </div>
              </div>

            </div>
          </section>

          {/* 2. DEVELOPER & ARCHITECT PROFILE SECTION (SHUBHAM MISHRA) */}
          <section className="bg-gradient-to-br from-[#1E2A5A] via-[#1a2550] to-[#0e1630] rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden transition-all duration-300 hover:shadow-cyan-950/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Avatar Icon Box */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/30 group-hover:rotate-3 transition-transform duration-300">
                  <div className="w-full h-full bg-[#1E2A5A] rounded-[22px] flex items-center justify-center">
                    <Code className="w-12 h-12 text-cyan-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 border-2 border-[#1E2A5A] flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold tracking-wide uppercase border border-cyan-400/30">
                    Lead Developer & Architect
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium border border-white/15">
                    Software Engineer
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Engineered with Passion by <span className="text-cyan-300">Shubham Mishra</span>
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  MindPulse was envisioned, architected, and engineered from scratch by <strong>Shubham Mishra</strong>. Motivated by the belief that lack of financial resources should never stop an ambitious mind from clearing government exams, Shubham engineered this modern, high-speed platform with enterprise React and cloud MongoDB infrastructure.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span>Full-Stack MERN Architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span>Mission: Free EdTech For India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Student-First Experience</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 3. COMMUNITY QUESTION CONTRIBUTION FORM */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-3d-card border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 text-cyan-600" />
                Community Collaboration
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                Want to Add Questions? Contribute to MindPulse!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Are you a teacher, educator, or aspirant with quality previous year questions, important mock questions, or verified solutions? Fill the form below — your question will go directly to <strong>Shubham Mishra's Admin Dashboard</strong> for review and publication!
              </p>
            </div>

            {/* Notification alert */}
            {statusMessage && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 transition-all ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                )}
                <span className="text-sm font-medium">{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Contributor details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contributorName"
                    value={formData.contributorName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contributorEmail"
                    value={formData.contributorEmail}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="contributorPhone"
                    value={formData.contributorPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Exam, Subject, Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Target Exam <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="exam"
                    value={formData.exam}
                    onChange={handleChange}
                    required
                    placeholder="e.g. UPSC CSE, SSC CGL, RRB NTPC"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Indian Polity, Quantitative Aptitude"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Topic / Sub-topic
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g. Fundamental Rights, Time & Work"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Question Statement */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Question Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="questionText"
                  rows="3"
                  value={formData.questionText}
                  onChange={handleChange}
                  required
                  placeholder="Type the full question clearly here..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                ></textarea>
              </div>

              {/* Row 4: 4 Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Option A <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="optionA"
                    value={formData.optionA}
                    onChange={handleChange}
                    required
                    placeholder="First option"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Option B <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="optionB"
                    value={formData.optionB}
                    onChange={handleChange}
                    required
                    placeholder="Second option"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Option C <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="optionC"
                    value={formData.optionC}
                    onChange={handleChange}
                    required
                    placeholder="Third option"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Option D <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="optionD"
                    value={formData.optionD}
                    onChange={handleChange}
                    required
                    placeholder="Fourth option"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Row 5: Correct Option & Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Correct Option <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Detailed Explanation / Solution (Optional)
                  </label>
                  <input
                    type="text"
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleChange}
                    placeholder="Why is this answer correct? Reference or formula..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting to Shubham Mishra...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Question for Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
