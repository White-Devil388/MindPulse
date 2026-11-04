import express from 'express';
import { register, login, syncUser, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sync', syncUser);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
