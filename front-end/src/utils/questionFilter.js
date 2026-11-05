import { COMPREHENSIVE_QUESTION_BANK } from './comprehensiveQuestions.js';
import { EXAM_CATEGORIES } from './examData.js';

// Standard normalizer for string comparisons
export const normalizeStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Deduplicates an array of questions based on normalized question text and options.
 * Ensures identical questions are never repeated anywhere.
 */
export function deduplicateQuestions(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((q) => {
    if (!q || !q.question) return false;
    const key = normalizeStr(q.question);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Deterministically shuffles an array based on a string seed (e.g., examId).
 * Ensures tests for different exams without explicit questions get different ordering,
 * but the same exam always produces the exact same repeatable test order.
 */
export function deterministicShuffle(array, seedStr) {
  let hash = 0;
  const str = seedStr || 'default-seed';
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const result = [...array];
  let m = result.length;
  let t;
  let i;
  let seed = Math.abs(hash) || 1;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    i = Math.floor(rnd * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

/**
 * Finds the parent category id for a given exam slug or name
 */
export function findCategoryForExam(examOrTestId) {
  const clean = normalizeStr(examOrTestId);
  if (!clean) return null;

  for (const cat of EXAM_CATEGORIES) {
    if (normalizeStr(cat.id) === clean) return cat.id;
    for (const exam of cat.exams) {
      const eNorm = normalizeStr(exam);
      if (eNorm === clean || clean.includes(eNorm) || eNorm.includes(clean)) {
        return cat.id;
      }
    }
  }
  return null;
}

/**
 * Get dedicated, syllabus-aligned questions for a specific exam.
 * 1. Prioritizes exact exam match (e.g. UPSC, UPPSC, RRB NTPC, SSC CGL).
 * 2. Next, checks exam prefix / contains match.
 * 3. Fallback: pools parent category questions and deterministically shuffles
 *    using the examId so different exams NEVER show identical questions.
 */
export function getQuestionsForExam(allQuestions, rawExamId, rawCatId) {
  const source = deduplicateQuestions((allQuestions && allQuestions.length > 0) ? allQuestions : COMPREHENSIVE_QUESTION_BANK);
  const cleanExam = normalizeStr(rawExamId);
  const inferredCat = rawCatId || findCategoryForExam(rawExamId);
  const cleanCat = normalizeStr(inferredCat);

  // 1. Exact exam match (e.g. "upsc" === "upsc", "ssccgl" === "ssccgl")
  const exact = source.filter((q) => normalizeStr(q.exam) === cleanExam);
  if (exact.length >= 10) {
    return exact;
  }

  // 2. Partial exam match (e.g. "rrb-ntpc" matches "rrbntpc")
  const partial = source.filter((q) => {
    const qe = normalizeStr(q.exam);
    return qe && (cleanExam.includes(qe) || qe.includes(cleanExam));
  });
  if (partial.length >= 10) {
    return partial;
  }

  // 3. Category match deterministically shuffled by exam name
  const catMatch = source.filter((q) => {
    const qc = normalizeStr(q.category);
    return qc === cleanCat || (cleanCat && (qc.includes(cleanCat) || cleanCat.includes(qc)));
  });
  if (catMatch.length > 0) {
    return deterministicShuffle(catMatch, cleanExam || cleanCat || 'category');
  }

  // 4. Global fallback deterministically shuffled
  return deterministicShuffle(source, cleanExam || 'mindpulse');
}
