// Centralized API Service for communicating with MindPulse Backend (MongoDB Atlas)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mindpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // --- Auth APIs ---
  async syncAuth(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        localStorage.setItem('mindpulse_token', data.data.token);
      }
      return data;
    } catch (err) {
      console.warn('Backend sync failed, continuing offline:', err.message);
      return null;
    }
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('mindpulse_token', data.data.token);
    }
    return data;
  },

  async register(name, email, password, phone = '') {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('mindpulse_token', data.data.token);
    }
    return data;
  },

  // --- Exams & Categories ---
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch categories from backend:', err.message);
      return null;
    }
  },

  async getExams(category = '', search = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/exams?${params.toString()}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch exams from backend:', err.message);
      return null;
    }
  },

  async getExamDetail(examSlug) {
    try {
      const res = await fetch(`${API_BASE_URL}/exams/${examSlug}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch exam detail from backend:', err.message);
      return null;
    }
  },

  // --- Questions & Quizzes ---
  async getQuestions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/questions?${query}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch questions from backend:', err.message);
      return null;
    }
  },

  async getDailyQuiz() {
    try {
      const res = await fetch(`${API_BASE_URL}/daily-quiz`);
      const data = await res.json();
      return data.success ? data : null;
    } catch (err) {
      console.warn('Failed to fetch daily quiz from backend:', err.message);
      return null;
    }
  },

  async reportQuestion(questionId, reason, description = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${questionId}/report`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason, description }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Report question failed:', err.message);
      return null;
    }
  },

  // --- Mock Tests & Submissions ---
  async getMockTests(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/tests?${query}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch mock tests from backend:', err.message);
      return null;
    }
  },

  async getTestById(testId) {
    try {
      const res = await fetch(`${API_BASE_URL}/tests/${testId}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch test by id:', err.message);
      return null;
    }
  },

  async submitAttempt(attemptData) {
    try {
      const res = await fetch(`${API_BASE_URL}/attempts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attemptData),
      });
      return await res.json();
    } catch (err) {
      console.warn('Submit attempt to backend failed:', err.message);
      return null;
    }
  },

  // --- User Dashboard Stats & Leaderboard ---
  async getPlatformOverview() {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/overview`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch platform overview:', err.message);
      return null;
    }
  },

  async getUserStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/me/stats`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch user stats from backend:', err.message);
      return null;
    }
  },

  async getLeaderboard(type = 'daily') {
    try {
      const res = await fetch(`${API_BASE_URL}/leaderboard?type=${type}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch leaderboard from backend:', err.message);
      return null;
    }
  },

  // --- Visitor & Analytics ---
  async trackVisit(path = window.location.pathname) {
    try {
      fetch(`${API_BASE_URL}/track-visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          referrer: document.referrer || '',
        }),
      }).catch(() => {});
    } catch (e) {}
  },

  // --- Admin Bulk Import & Stats ---
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch admin stats from backend:', err.message);
      return null;
    }
  },

  async getAdminAspirants() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/aspirants`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Failed to fetch admin aspirants from backend:', err.message);
      return null;
    }
  },

  async bulkUploadQuestions(questions) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions/bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questions }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Bulk upload failed:', err.message);
      return null;
    }
  },
};

export default api;

