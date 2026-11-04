import express from 'express';
import {
  getQuestions,
  reportQuestion,
  getDailyQuiz,
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/questions/:id/report', reportQuestion);
router.get('/daily-quiz', getDailyQuiz);

export default router;

