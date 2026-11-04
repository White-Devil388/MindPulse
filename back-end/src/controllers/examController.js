import { EXAM_CATEGORIES, toSlug } from '../utils/examData.js';
import { Exam } from '../models/Exam.js';
import { memoryCache } from '../utils/cache.js';

// @desc    Get all exam categories (Cached)
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const cacheKey = 'exam_categories_all';
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=3600');
      return res.json(cached);
    }

    const responsePayload = {
      success: true,
      data: EXAM_CATEGORIES,
    };

    memoryCache.set(cacheKey, responsePayload, 3600); // 1 hour in-memory cache
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get exams with filter (Cached + .lean())
// @route   GET /api/exams
export const getExams = async (req, res) => {
  try {
    const { category, search } = req.query;
    const cacheKey = `exams_${category || 'all'}_${(search || '').toLowerCase()}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=1800');
      return res.json(cached);
    }

    let allExams = [];
    try {
      let query = {};
      if (category && category !== 'all') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };

      // Query database with lean() for raw performance
      allExams = await Exam.find(query)
        .select('name slug category description totalQuestions totalMockTests')
        .lean();
    } catch (e) {
      allExams = [];
    }

    // Fallback to examData utils if DB empty
    if (!allExams || allExams.length === 0) {
      allExams = [];
      EXAM_CATEGORIES.forEach((cat) => {
        cat.exams.forEach((examName) => {
          allExams.push({
            name: examName,
            slug: toSlug(examName),
            category: cat.id,
            categoryName: cat.name,
            color: cat.color,
            icon: cat.icon,
          });
        });
      });

      if (category && category !== 'all') {
        allExams = allExams.filter((e) => e.category === category);
      }

      if (search) {
        const q = search.toLowerCase();
        allExams = allExams.filter((e) => e.name.toLowerCase().includes(q));
      }
    }

    const responsePayload = {
      success: true,
      count: allExams.length,
      data: allExams,
    };

    memoryCache.set(cacheKey, responsePayload, 1800); // 30 minutes cache
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=1800');
    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single exam details
// @route   GET /api/exams/:id
export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const targetSlug = id.toLowerCase();
    const cacheKey = `exam_detail_${targetSlug}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=1800');
      return res.json(cached);
    }

    let foundExam = null;
    try {
      foundExam = await Exam.findOne({ slug: targetSlug }).lean();
    } catch (e) {}

    if (!foundExam) {
      for (const cat of EXAM_CATEGORIES) {
        for (const examName of cat.exams) {
          if (toSlug(examName) === targetSlug || examName.toLowerCase() === targetSlug) {
            foundExam = {
              name: examName,
              slug: toSlug(examName),
              category: cat.id,
              categoryName: cat.name,
              color: cat.color,
              icon: cat.icon,
            };
            break;
          }
        }
        if (foundExam) break;
      }
    }

    if (!foundExam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const detailedData = {
      ...foundExam,
      conductingBody: foundExam.category === 'civil-services' ? 'Union/State Public Service Commission' : 'Staff Selection Commission / Respective Board',
      totalMockTests: 45,
      totalQuestions: 2200,
      pattern: [
        { stage: 'Prelims / Tier 1', duration: '60-120 mins', totalMarks: 200, negativeMarking: '0.33 or 0.50' },
        { stage: 'Mains / Tier 2', duration: '120 mins', totalMarks: 400, negativeMarking: '0.33' },
      ],
      subjects: [
        { id: 'general-studies', name: 'General Studies & GK', topicCount: 24 },
        { id: 'quantitative-aptitude', name: 'Quantitative Aptitude', topicCount: 18 },
        { id: 'reasoning-ability', name: 'General Intelligence & Reasoning', topicCount: 16 },
        { id: 'english-language', name: 'English Comprehension', topicCount: 12 },
      ]
    };

    const responsePayload = { success: true, data: detailedData };
    memoryCache.set(cacheKey, responsePayload, 1800);
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=1800');
    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
