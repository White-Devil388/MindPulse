import React, { createContext, useContext, useState, useEffect } from 'react';
import { EXAM_CATEGORIES } from '../utils/examData';
import { COMPREHENSIVE_QUESTION_BANK } from '../utils/comprehensiveQuestions';

const AdminDataContext = createContext(null);

const INITIAL_MOCK_TESTS = [
  {
    id: 'test-1',
    title: 'UPSC Prelims GS-1 Full Mock 2026',
    category: 'civil-services',
    exam: 'UPSC',
    duration: 120, // in minutes
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'Advanced',
    status: 'Published',
    attemptsCount: 1420,
    dateAdded: '2026-10-15',
  },
  {
    id: 'test-2',
    title: 'SSC CGL Tier-1 Speed Booster Test #4',
    category: 'ssc',
    exam: 'SSC CGL',
    duration: 60,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'Moderate',
    status: 'Published',
    attemptsCount: 3890,
    dateAdded: '2026-10-20',
  },
  {
    id: 'test-3',
    title: 'IBPS PO Prelims Quant & Reasoning Marathon',
    category: 'banking',
    exam: 'IBPS PO',
    duration: 60,
    totalQuestions: 100,
    totalMarks: 100,
    difficulty: 'Moderate',
    status: 'Published',
    attemptsCount: 2150,
    dateAdded: '2026-10-25',
  },
  {
    id: 'test-4',
    title: 'RRB NTPC CBT-2 General Awareness Special',
    category: 'railway',
    exam: 'RRB NTPC',
    duration: 90,
    totalQuestions: 120,
    totalMarks: 120,
    difficulty: 'Easy',
    status: 'Draft',
    attemptsCount: 0,
    dateAdded: '2026-10-28',
  },
];

const INITIAL_QUESTIONS = [
  {
    id: 'q-101',
    category: 'civil-services',
    exam: 'UPSC',
    subject: 'Polity',
    question: 'Under which Article of the Constitution can the President promulgate an Ordinance?',
    options: ['Article 72', 'Article 123', 'Article 143', 'Article 213'],
    correctOption: 1, // Article 123
    explanation: 'Article 123 of the Constitution empowers the President to promulgate Ordinances during the recess of Parliament.',
    difficulty: 'Medium',
  },
  {
    id: 'q-102',
    category: 'ssc',
    exam: 'SSC CGL',
    subject: 'Quantitative Aptitude',
    question: 'If A:B = 2:3 and B:C = 4:5, then what is the ratio of A:B:C?',
    options: ['8:12:15', '2:3:5', '8:10:15', '6:9:15'],
    correctOption: 0, // 8:12:15
    explanation: 'Multiply A:B by 4 -> 8:12, and B:C by 3 -> 12:15. So A:B:C = 8:12:15.',
    difficulty: 'Easy',
  },
  {
    id: 'q-103',
    category: 'banking',
    exam: 'SBI PO',
    subject: 'Banking Awareness',
    question: 'What does the term "Repo Rate" signify in Indian monetary policy?',
    options: [
      'Rate at which banks lend to public',
      'Rate at which RBI lends money to commercial banks',
      'Rate at which RBI borrows from commercial banks',
      'Exchange rate against USD',
    ],
    correctOption: 1,
    explanation: 'Repo rate is the key benchmark rate at which the RBI lends money to commercial banks against government securities.',
    difficulty: 'Medium',
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'UPSC 2026 All India Mega Scholarship Test Live on Sunday',
    type: 'Notification',
    status: 'Active',
    date: '2026-11-01',
  },
  {
    id: 'ann-2',
    title: 'Free 500+ PYQ Solutions uploaded for SSC GD Constable',
    type: 'Update',
    status: 'Active',
    date: '2026-10-29',
  },
];

export const AdminDataProvider = ({ children }) => {
  // Categories state
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mindpulse_admin_categories');
    return saved ? JSON.parse(saved) : EXAM_CATEGORIES;
  });

  // Mock tests state
  const [mockTests, setMockTests] = useState(() => {
    const saved = localStorage.getItem('mindpulse_admin_mocktests');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TESTS;
  });

  // Question bank state
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('mindpulse_admin_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1000) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Default to the full 2,200 non-repeating comprehensive bank
    localStorage.setItem('mindpulse_admin_questions', JSON.stringify(COMPREHENSIVE_QUESTION_BANK));
    return COMPREHENSIVE_QUESTION_BANK;
  });

  // Announcements / Notice banner state
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('mindpulse_admin_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Aspirants registered
  const [aspirants, setAspirants] = useState([]);

  // Auto-fetch real registered students from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    import('../services/api').then(({ default: api }) => {
      api.getAdminAspirants().then((data) => {
        if (isMounted && data && Array.isArray(data)) {
          setAspirants(data);
          localStorage.setItem('mindpulse_admin_aspirants', JSON.stringify(data));
        }
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem('mindpulse_admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mindpulse_admin_mocktests', JSON.stringify(mockTests));
  }, [mockTests]);

  useEffect(() => {
    localStorage.setItem('mindpulse_admin_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('mindpulse_admin_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('mindpulse_admin_aspirants', JSON.stringify(aspirants));
  }, [aspirants]);

  // CRUD actions for Mock Tests
  const addMockTest = (test) => {
    const newTest = {
      ...test,
      id: `test-${Date.now()}`,
      attemptsCount: 0,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setMockTests((prev) => [newTest, ...prev]);
  };

  const deleteMockTest = (id) => {
    setMockTests((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTestStatus = (id) => {
    setMockTests((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Published' ? 'Draft' : 'Published' } : t
      )
    );
  };

  // CRUD actions for Questions
  const addQuestion = (q) => {
    const newQ = {
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  // Bulk Import Questions from JSON (single object or array of objects)
  const importQuestionsBulk = (newQuestionsArray) => {
    if (!Array.isArray(newQuestionsArray)) {
      return { success: false, message: 'JSON must be an array of question objects.' };
    }

    const validated = [];
    for (let i = 0; i < newQuestionsArray.length; i++) {
      const item = newQuestionsArray[i];
      if (!item.question || !Array.isArray(item.options) || item.options.length < 2) {
        return {
          success: false,
          message: `Item #${i + 1} is invalid. Each question must have 'question' and at least 2 'options'.`,
        };
      }

      validated.push({
        id: item.id || `q-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        category: item.category || 'general',
        exam: item.exam || 'All Exams',
        subject: item.subject || 'General Studies',
        question: String(item.question),
        options: item.options.map(String),
        correctOption: typeof item.correctOption === 'number' ? item.correctOption : 0,
        explanation: item.explanation || 'Answer verified by question bank.',
        difficulty: item.difficulty || 'Medium',
      });
    }

    setQuestions((prev) => [...validated, ...prev]);
    return { success: true, count: validated.length };
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // CRUD actions for Categories
  const addExamToCategory = (catId, newExamName) => {
    if (!newExamName.trim()) return;
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId && !cat.exams.includes(newExamName.trim())) {
          return { ...cat, exams: [...cat.exams, newExamName.trim()] };
        }
        return cat;
      })
    );
  };

  const removeExamFromCategory = (catId, examName) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return { ...cat, exams: cat.exams.filter((e) => e !== examName) };
        }
        return cat;
      })
    );
  };

  // CRUD for Announcements
  const addAnnouncement = (item) => {
    const newItem = {
      ...item,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setAnnouncements((prev) => [newItem, ...prev]);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Aspirant user actions
  const toggleAspirantStatus = (id) => {
    setAspirants((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
  };

  const resetToComprehensiveBank = () => {
    setQuestions(COMPREHENSIVE_QUESTION_BANK);
    localStorage.setItem('mindpulse_admin_questions', JSON.stringify(COMPREHENSIVE_QUESTION_BANK));
  };

  return (
    <AdminDataContext.Provider
      value={{
        categories,
        mockTests,
        questions,
        announcements,
        aspirants,
        addMockTest,
        deleteMockTest,
        toggleTestStatus,
        addQuestion,
        importQuestionsBulk,
        deleteQuestion,
        resetToComprehensiveBank,
        addExamToCategory,
        removeExamFromCategory,
        addAnnouncement,
        deleteAnnouncement,
        toggleAspirantStatus,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return ctx;
};

