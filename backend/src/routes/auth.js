import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { login, register, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

export default router;
