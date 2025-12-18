import express from 'express';
import {
    getAllChallenges,
    getChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getMyChallenges
} from '../controllers/challengeController.js';

const router = express.Router();

router.get('/', getAllChallenges);
router.get('/my', getMyChallenges);
router.get('/:id', getChallengeById);
router.post('/', createChallenge);
router.put('/:id', updateChallenge);
router.delete('/:id', deleteChallenge);

export default router;
