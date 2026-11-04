import express from 'express';
import {
  getTests,
  getTestById,
  submitAttempt,
  getAttemptById,
} from '../controllers/testController.js';

const router = express.Router();

router.get('/tests', getTests);
router.get('/tests/:id', getTestById);
router.post('/attempts', submitAttempt);
router.get('/attempts/:id', getAttemptById);

export default router;

