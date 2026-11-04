import express from 'express';
import {
  getUserStats,
  getBookmarks,
  toggleBookmark,
  getWrongQuestions,
  getLeaderboard,
  getPlatformOverview,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/stats/overview', getPlatformOverview);
router.get('/me/stats', getUserStats);
router.get('/me/bookmarks', getBookmarks);
router.post('/me/bookmarks/:questionId', toggleBookmark);
router.get('/me/wrong-questions', getWrongQuestions);
router.get('/leaderboard', getLeaderboard);

export default router;
