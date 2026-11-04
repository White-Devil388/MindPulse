import express from 'express';
import {
  getAdminStats,
  getAdminAspirants,
  addQuestion,
  bulkUploadQuestions,
  trackVisit,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/track-visit', trackVisit);
router.get('/admin/stats', getAdminStats);
router.get('/admin/aspirants', getAdminAspirants);
router.post('/admin/questions', addQuestion);
router.post('/admin/questions/bulk', bulkUploadQuestions);

export default router;
