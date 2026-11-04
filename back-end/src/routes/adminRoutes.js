import express from 'express';
import {
  getAdminStats,
  getAdminAspirants,
  addQuestion,
  bulkUploadQuestions,
  trackVisit,
  submitQuestion,
  getSubmissions,
  updateSubmissionStatus,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/track-visit', trackVisit);
router.post('/questions/submit', submitQuestion);
router.get('/admin/stats', getAdminStats);
router.get('/admin/aspirants', getAdminAspirants);
router.get('/admin/submissions', getSubmissions);
router.patch('/admin/submissions/:id/status', updateSubmissionStatus);
router.post('/admin/questions', addQuestion);
router.post('/admin/questions/bulk', bulkUploadQuestions);

export default router;
