import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { ArrowLeft, Mail, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message;

  // Real database authentication: Only registered users with matching password can sign in
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);

      if (res && res.success) {
        localStorage.setItem('examprep_user', JSON.stringify(res.data));
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Invalid email or password. Please check your credentials or Sign Up.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to login server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Real Google Sign-In with official Google OAuth Popup
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const googleUser = await res.json();

        const userPayload = {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          provider: 'google',
        };

        const syncRes = await api.syncAuth(userPayload);
        // If backend sync succeeds or falls back, always create authenticated session
        const sessionUser = (syncRes && syncRes.data) ? syncRes.data : userPayload;
        localStorage.setItem('examprep_user', JSON.stringify(sessionUser));
        navigate('/dashboard');
      } catch (err) {
        console.error('Google profile error:', err);
        setError('Failed to fetch Google profile. Please try again.');
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      setError('Google Sign-In was cancelled or failed.');
    },
  });

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white mb-6 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* 3D Glass Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-950/30 border border-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/30">
              M
            </div>
            <h2 className="text-2xl font-extrabold text-[#1E2A5A] tracking-tight">
              Sign In to MindPulse
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered credentials to access your dashboard
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full py-3 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.99] transition-all group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="group-hover:text-slate-900 font-bold">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              Or with email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all mt-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In with Email'}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Create an Account (Sign Up)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
