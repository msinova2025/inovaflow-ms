import express from 'express';
import {
    getAllChallenges,
    getChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getMyChallenges
} from '../controllers/challengeController.js';

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllChallenges);
router.get('/my', authenticateToken, getMyChallenges);
router.get('/:id', getChallengeById);
router.post('/', authenticateToken, createChallenge);
router.put('/:id', updateChallenge);
router.delete('/:id', deleteChallenge);

export default router;
