import express from 'express';
import { getAllHowToParticipate, createHowToParticipate, updateHowToParticipate, deleteHowToParticipate } from '../controllers/howToParticipateController.js';

const router = express.Router();

router.get('/', getAllHowToParticipate);
router.post('/', createHowToParticipate);
router.put('/:id', updateHowToParticipate);
router.delete('/:id', deleteHowToParticipate);

export default router;
