import { Question } from '../models/Question.js';
import { memoryCache } from '../utils/cache.js';

// Pre-seeded high quality sample questions matching front-end MockTestAttempt.jsx & specs
export const SEED_QUESTIONS = [
  {
    _id: "660fa1011111111111111101",
    category: "civil-services",
    exam: "upsc",
    subject: "history",
    topic: "ancient-india",
    question: {
      en: "Who among the following was the founder of the Maurya Empire?",
      hi: "निम्नलिखित में से कौन मौर्य साम्राज्य का संस्थापक था?",
    },
    options: [
      { en: "Ashoka", hi: "अशोक" },
      { en: "Chandragupta Maurya", hi: "चन्द्रगुप्त मौर्य" },
      { en: "Bindusara", hi: "बिन्दुसार" },
      { en: "Samudragupta", hi: "समुद्रगुप्त" },
    ],
    correct: 1,
    explanation: {
      en: "Chandragupta Maurya founded the Maurya Empire in 322 BCE after overthrowing the Nanda dynasty with the help of Chanakya (Kautilya).",
      hi: "चाणक्य (कौटिल्य) की सहायता से नंद वंश को उखाड़ फेंकने के बाद चन्द्रगुप्त मौर्य ने 322 ईसा पूर्व में मौर्य साम्राज्य की स्थापना की थी।",
    },
    difficulty: "medium",
    year: 2022,
    source: "UPSC CSE Prelims / MPPSC",
  },
  {
    _id: "660fa1011111111111111102",
    category: "civil-services",
    exam: "upsc",
    subject: "polity",
    topic: "fundamental-rights",
    question: {
      en: "Which article of the Indian Constitution provides for the right to constitutional remedies?",
      hi: "भारतीय संविधान का कौन सा अनुच्छेद संवैधानिक उपचारों का अधिकार प्रदान करता है?",
    },
    options: [
      { en: "Article 21", hi: "अनुच्छेद 21" },
      { en: "Article 19", hi: "अनुच्छेद 19" },
      { en: "Article 32", hi: "अनुच्छेद 32" },
      { en: "Article 14", hi: "अनुच्छेद 14" },
    ],
    correct: 2,
    explanation: {
      en: "Article 32 gives citizens the right to move the Supreme Court for enforcement of fundamental rights. Dr. B.R. Ambedkar called it the 'Heart and Soul' of the Constitution.",
      hi: "अनुच्छेद 32 नागरिकों को मौलिक अधिकारों के प्रवर्तन के लिए सर्वोच्च न्यायालय जाने का अधिकार देता है। डॉ. बी.आर. अम्बेडकर ने इसे संविधान का 'हृदय और आत्मा' कहा था।",
    },
    difficulty: "easy",
    year: 2021,
    source: "UPSC CSE / SSC CGL",
  },
  {
    _id: "660fa1011111111111111103",
    category: "ssc",
    exam: "ssc-cgl",
    subject: "quantitative-aptitude",
    topic: "time-and-work",
    question: {
      en: "If 12 men can complete a work in 15 days, in how many days can 20 men complete the same work?",
      hi: "यदि 12 पुरुष किसी कार्य को 15 दिनों में पूरा कर सकते हैं, तो 20 पुरुष उसी कार्य को कितने दिनों में पूरा करेंगे?",
    },
    options: [
      { en: "8 days", hi: "8 दिन" },
      { en: "9 days", hi: "9 दिन" },
      { en: "10 days", hi: "10 दिन" },
      { en: "12 days", hi: "12 दिन" },
    ],
    correct: 1,
    explanation: {
      en: "Work = M1 × D1 = 12 × 15 = 180 man-days. Days required for 20 men = 180 / 20 = 9 days.",
      hi: "कुल कार्य = M1 × D1 = 12 × 15 = 180 मानव-दिन। 20 पुरुषों के लिए आवश्यक दिन = 180 / 20 = 9 दिन।",
    },
    difficulty: "medium",
    year: 2023,
    source: "SSC CGL Tier 1",
  },
  {
    _id: "660fa1011111111111111104",
    category: "civil-services",
    exam: "upsc",
    subject: "geography",
    topic: "indian-geography",
    question: {
      en: "Which of the following passes connects Srinagar with Leh?",
      hi: "निम्नलिखित में से कौन सा दर्रा श्रीनगर को लेह से जोड़ता है?",
    },
    options: [
      { en: "Zoji La Pass", hi: "ज़ोजिला दर्रा" },
      { en: "Banihal Pass", hi: "बनिहाल दर्रा" },
      { en: "Rohtang Pass", hi: "रोहतांग दर्रा" },
      { en: "Nathu La Pass", hi: "नाथू ला दर्रा" },
    ],
    correct: 0,
    explanation: {
      en: "Zoji La Pass is located in the Zaskar range and connects Srinagar with Leh. Banihal connects Jammu with Srinagar.",
      hi: "ज़ोजिला दर्रा ज़ांस्कर श्रेणी में स्थित है और श्रीनगर को लेह से जोड़ता है।",
    },
    difficulty: "medium",
    year: 2020,
    source: "NDA / CDS / UPSC",
  },
  {
    _id: "660fa1011111111111111105",
    category: "ssc",
    exam: "ssc-cgl",
    subject: "reasoning",
    topic: "number-series",
    question: {
      en: "Find the missing number in the series: 3, 7, 15, 31, 63, ?",
      hi: "श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 3, 7, 15, 31, 63, ?",
    },
    options: [
      { en: "127", hi: "127" },
      { en: "126", hi: "126" },
      { en: "125", hi: "125" },
      { en: "128", hi: "128" },
    ],
    correct: 0,
    explanation: {
      en: "Pattern: ×2 + 1 -> (3×2)+1=7, (7×2)+1=15, (15×2)+1=31, (31×2)+1=63, (63×2)+1 = 127.",
      hi: "पैटर्न: ×2 + 1 -> (63×2)+1 = 127.",
    },
    difficulty: "easy",
    year: 2022,
    source: "SSC CHSL / CGL",
  },
];

// @desc    Get questions with pagination, field projection, and .lean()
// @route   GET /api/questions
export const getQuestions = async (req, res) => {
  try {
    const { category, exam, subject, topic, difficulty, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))); // Cap limit to 100 for memory safety

    const cacheKey = `questions_${category || ''}_${exam || ''}_${subject || ''}_${difficulty || ''}_p${pageNum}_l${limitNum}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    let query = {};
    if (category) query.category = category;
    if (exam) query.exam = exam.toLowerCase();
    if (subject) query.subject = subject.toLowerCase();
    if (topic) query.topic = topic.toLowerCase();
    if (difficulty) query.difficulty = difficulty.toLowerCase();

    let questions = [];
    let totalCount = 0;

    try {
      // Execute query with .lean() and projection for max throughput
      [questions, totalCount] = await Promise.all([
        Question.find(query)
          .select('category exam subject topic question options correct explanation difficulty year source')
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        Question.countDocuments(query),
      ]);
    } catch (e) {
      questions = [];
      totalCount = 0;
    }

    if (!questions || questions.length === 0) {
      questions = SEED_QUESTIONS;
      if (difficulty) {
        questions = questions.filter((q) => q.difficulty === difficulty.toLowerCase());
      }
      totalCount = questions.length;
    }

    const responsePayload = {
      success: true,
      count: questions.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      data: questions,
    };

    // Cache question pages for 5 minutes
    memoryCache.set(cacheKey, responsePayload, 300);
    res.set('X-Cache', 'MISS');
    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Report question inaccuracy
// @route   POST /api/questions/:id/report
export const reportQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Question.findByIdAndUpdate(id, { $inc: { reportsCount: 1 } });
    } catch (e) {}

    res.json({
      success: true,
      message: 'Question reported successfully. Our academic team will review it.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Daily 10 Questions Quiz
// @route   GET /api/daily-quiz
export const getDailyQuiz = async (req, res) => {
  try {
    const cacheKey = 'daily_quiz_today';
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    let dailyQuestions = [];
    try {
      dailyQuestions = await Question.find({})
        .select('category exam subject question options correct explanation difficulty')
        .limit(10)
        .lean();
    } catch (e) {
      dailyQuestions = SEED_QUESTIONS;
    }

    const payload = {
      success: true,
      title: 'MindPulse Daily Speed Challenge (10 Questions)',
      totalQuestions: dailyQuestions.length,
      durationMinutes: 10,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      questions: dailyQuestions,
    };

    memoryCache.set(cacheKey, payload, 3600); // 1 hour cache
    res.set('X-Cache', 'MISS');
    res.json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
