import React, { useState } from 'react';
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
  Clock
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
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header / Mission Hero */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            Our Vision & Core Agenda
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Democratizing Education: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Free Mock Test Practice For Every Aspirant
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            At MindPulse, our sole agenda is to provide <strong>100% free, high-quality, and realistic exam practice</strong> to every government exam aspirant across India. Quality education and rigorous test preparation should not be a privilege reserved for those who can afford expensive coaching subscriptions — it should be accessible to all.
          </p>
        </section>

        {/* 100% Lifetime Free Pledge Card */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-cyan-400" />
          </div>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Guaranteed Commitment
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Lifetime Free — No Paywalls, No Subscriptions Ever!
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every mock test, chapter-wise quiz, detailed solution, and previous year question paper (PYQ) on MindPulse will <strong>remain permanently free forever</strong>. No hidden fees, no credit cards required, and no locked tests after a 3-day trial.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <BookOpenCheck className="w-6 h-6 text-cyan-400 mb-2" />
                <h4 className="font-semibold text-sm text-white">88+ Exams Covered</h4>
                <p className="text-xs text-slate-400">UPSC, SSC, Banking, Railways & Defence</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-6 h-6 text-yellow-400 mb-2" />
                <h4 className="font-semibold text-sm text-white">Real Exam Timers</h4>
                <p className="text-xs text-slate-400">Exact negative marking & live analytics</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Globe2 className="w-6 h-6 text-purple-400 mb-2" />
                <h4 className="font-semibold text-sm text-white">Bilingual English & Hindi</h4>
                <p className="text-xs text-slate-400">Switch languages dynamically</p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator / Software Engineer Profile Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
              <Code className="w-12 h-12" />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-semibold">
                <Award className="w-4 h-4" />
                Creator & Software Engineer
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Engineered with Passion by Shubham Mishra
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                MindPulse was designed, architected, and built by <strong>Shubham Mishra</strong>, a passionate Software Engineer dedicated to leveraging technology for social impact. With a vision to empower every hardworking student from every corner of India, Shubham built MindPulse to eliminate expensive educational barriers and give students enterprise-grade practice tools completely free.
              </p>
            </div>
          </div>
        </section>

        {/* Community Question Contribution Form Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-800/90 border border-cyan-500/30 shadow-2xl space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" />
              Community Question Contribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Want to Add Questions? Contribute to MindPulse!
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              If you have high-quality previous year questions, important mock test questions, or verified solutions, submit them below. Once submitted, they will appear directly in Shubham Mishra's Admin Dashboard for verification and inclusion in the main question bank!
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-900/40 border border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-900/40 border border-rose-500/50 text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span className="text-sm">{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contributor details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="contributorName"
                  value={formData.contributorName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Shubham Mishra"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contributorEmail"
                  value={formData.contributorEmail}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contributorPhone"
                  value={formData.contributorPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Exam and Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Exam *
                </label>
                <input
                  type="text"
                  name="exam"
                  value={formData.exam}
                  onChange={handleChange}
                  required
                  placeholder="e.g. UPSC CSE, SSC CGL, IBPS PO"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Indian Polity, Quantitative Aptitude"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Topic / Sub-topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Fundamental Rights, Percentages"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Question Statement *
              </label>
              <textarea
                name="questionText"
                rows="3"
                value={formData.questionText}
                onChange={handleChange}
                required
                placeholder="Type the full question clearly here..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              ></textarea>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Option A *
                </label>
                <input
                  type="text"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  required
                  placeholder="First option"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Option B *
                </label>
                <input
                  type="text"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  required
                  placeholder="Second option"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Option C *
                </label>
                <input
                  type="text"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  required
                  placeholder="Third option"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Option D *
                </label>
                <input
                  type="text"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  required
                  placeholder="Fourth option"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Correct Option & Explanation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Correct Option *
                </label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Explanation / Solution (Optional)
                </label>
                <input
                  type="text"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Why is this answer correct? Reference or formula..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting to Admin...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Question to Shubham Mishra</span>
                </>
              )}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
