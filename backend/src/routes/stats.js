import express from 'express';
import { getStats, logAccess, getAccessLogs } from '../controllers/statsController.js';
import { authMiddlewareOptional } from '../middleware/authOptional.js';
const router = express.Router();

router.get('/', getStats);
router.get('/access', getAccessLogs);
router.post('/access', authMiddlewareOptional, logAccess);
export default router;