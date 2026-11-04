import express from 'express';
import { getCategories, getExams, getExamById } from '../controllers/examController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/exams', getExams);
router.get('/exams/:id', getExamById);

export default router;

