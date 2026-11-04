import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import { Exam } from '../models/Exam.js';
import { Question } from '../models/Question.js';
import { MockTest } from '../models/MockTest.js';
import { EXAM_CATEGORIES, toSlug } from '../utils/examData.js';
import { COMPREHENSIVE_QUESTION_BANK } from '../../../front-end/src/utils/comprehensiveQuestions.js';

// Setup DNS for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

// Pre-defined mock tests matching front-end AdminDataContext & pages
const INITIAL_MOCK_TESTS = [
  {
    title: {
      en: 'UPSC Prelims GS-1 Full Mock 2026',
      hi: 'यूपीएससी प्रारंभिक जीएस-1 फुल मॉक 2026',
    },
    slug: 'upsc-prelims-gs1',
    category: 'civil-services',
    exam: 'upsc',
    type: 'full',
    durationMinutes: 120,
    totalMarks: 200,
    negativeMarking: 0.66,
    markPerQuestion: 2,
  },
  {
    title: {
      en: 'SSC CGL Tier-1 Speed Booster Test #4',
      hi: 'एसएससी सीजीएल टियर-1 स्पीड बूस्टर टेस्ट #4',
    },
    slug: 'ssc-cgl-daily-live',
    category: 'ssc',
    exam: 'ssc-cgl',
    type: 'full',
    durationMinutes: 60,
    totalMarks: 200,
    negativeMarking: 0.5,
    markPerQuestion: 2,
  },
  {
    title: {
      en: 'IBPS PO Prelims Quant & Reasoning Marathon',
      hi: 'आईबीपीएस पीओ प्रीलिम्स क्वांट और रीजनिंग मैराथन',
    },
    slug: 'ibps-po-prelims-speed',
    category: 'banking',
    exam: 'ibps-po',
    type: 'sectional',
    durationMinutes: 60,
    totalMarks: 100,
    negativeMarking: 0.25,
    markPerQuestion: 1,
  },
  {
    title: {
      en: 'RRB NTPC CBT-2 General Awareness Special',
      hi: 'आरआरबी एनटीपीसी सीबीटी-2 सामान्य जागरूकता विशेष',
    },
    slug: 'rrb-ntpc-cbt2-ga',
    category: 'railway',
    exam: 'rrb-ntpc',
    type: 'full',
    durationMinutes: 90,
    totalMarks: 120,
    negativeMarking: 0.33,
    markPerQuestion: 1,
  },
  {
    title: {
      en: 'NDA Mathematics & General Ability Mega Mock',
      hi: 'एनडीए गणित एवं सामान्य योग्यता मेगा मॉक',
    },
    slug: 'nda-math-gat-mock',
    category: 'defence',
    exam: 'nda',
    type: 'full',
    durationMinutes: 150,
    totalMarks: 300,
    negativeMarking: 0.83,
    markPerQuestion: 2.5,
  },
  {
    title: {
      en: 'CTET Paper 1 Child Development & Pedagogy',
      hi: 'सीटीईटी पेपर 1 बाल विकास एवं शिक्षाशास्त्र',
    },
    slug: 'ctet-paper-1-cdp',
    category: 'teaching',
    exam: 'ctet',
    type: 'topic',
    durationMinutes: 60,
    totalMarks: 50,
    negativeMarking: 0,
    markPerQuestion: 1,
  },
  {
    title: {
      en: 'JEE Main Physics & Chemistry Quick Sprint',
      hi: 'जेईई मेन भौतिकी और रसायन विज्ञान क्विक स्प्रिंट',
    },
    slug: 'jee-main-quick-sprint',
    category: 'engineering-medical',
    exam: 'jee-main',
    type: 'sectional',
    durationMinutes: 90,
    totalMarks: 150,
    negativeMarking: 1,
    markPerQuestion: 4,
  },
];

const seedAll = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing in .env');

    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('[Seed] Connected to Atlas database:', mongoose.connection.name);

    // 1. Seed All 88 Exams across 10 Categories
    console.log('[Seed] Seeding Exams from examData.js...');
    await Exam.deleteMany({});
    let examDocs = [];
    EXAM_CATEGORIES.forEach((cat) => {
      cat.exams.forEach((examName) => {
        examDocs.push({
          name: examName,
          slug: toSlug(examName),
          category: cat.id,
          description: {
            en: `Complete preparation, syllabus and mock tests for ${examName}.`,
            hi: `${examName} के लिए संपूर्ण तैयारी, पाठ्यक्रम और मॉक टेस्ट।`,
          },
          totalQuestions: 2200,
          totalMockTests: 15,
        });
      });
    });
    await Exam.insertMany(examDocs);
    console.log(`[Seed] ✅ Seeded ${examDocs.length} Exams across 10 categories.`);

    // 2. Seed All 2,200+ Questions from front-end comprehensiveQuestions.js
    console.log(`[Seed] Preparing ${COMPREHENSIVE_QUESTION_BANK.length} comprehensive questions from frontend...`);
    await Question.deleteMany({});

    // Map frontend questions format into backend Mongoose schema
    const questionDocs = COMPREHENSIVE_QUESTION_BANK.map((q, idx) => {
      const difficultyLower = (q.difficulty || 'Medium').toLowerCase();
      const validDifficulty = ['easy', 'medium', 'hard'].includes(difficultyLower)
        ? difficultyLower
        : 'medium';

      return {
        category: q.category || 'civil-services',
        exam: (q.exam || 'UPSC').toLowerCase().replace(/\s+/g, '-'),
        subject: (q.subject || 'General Knowledge').toLowerCase().replace(/\s+/g, '-'),
        topic: (q.subject || 'General Studies').toLowerCase().replace(/\s+/g, '-'),
        question: {
          en: q.question || '',
          hi: '', // english primary with fallback
        },
        options: (q.options || []).map((opt) => ({
          en: String(opt),
          hi: '',
        })),
        correct: typeof q.correctOption === 'number' ? q.correctOption : 0,
        explanation: {
          en: q.explanation || 'Detailed concept explanation available in study material.',
          hi: '',
        },
        difficulty: validDifficulty,
        year: 2024,
        source: `${q.exam || 'Competitive'} Exam Prep Series`,
        tags: [q.category, q.subject, q.exam].filter(Boolean),
      };
    });

    // Bulk insert in chunks for MongoDB Atlas optimal performance
    const chunkSize = 500;
    for (let i = 0; i < questionDocs.length; i += chunkSize) {
      const chunk = questionDocs.slice(i, i + chunkSize);
      await Question.insertMany(chunk);
      console.log(`[Seed] Processed questions ${i + 1} to ${Math.min(i + chunkSize, questionDocs.length)}...`);
    }
    console.log(`[Seed] ✅ Successfully seeded all ${questionDocs.length} Questions into MongoDB Atlas!`);

    // 3. Seed Mock Tests and associate question references
    console.log('[Seed] Seeding Mock Tests...');
    await MockTest.deleteMany({});
    
    // Pick sample question IDs for each mock test
    const allInsertedQuestions = await Question.find({}, '_id category').limit(150);
    const questionIds = allInsertedQuestions.map((q) => q._id);

    const testDocs = INITIAL_MOCK_TESTS.map((test) => ({
      ...test,
      questions: questionIds.slice(0, 30), // attach 30 questions per mock test
    }));

    await MockTest.insertMany(testDocs);
    console.log(`[Seed] ✅ Seeded ${testDocs.length} Mock Tests into MongoDB Atlas.`);

    console.log('\n🎉 ALL FRONTEND DATA SUCCESSFULLY SYNCED AND SEEDED TO MONGODB ATLAS!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]:`, error);
    process.exit(1);
  }
};

seedAll();
