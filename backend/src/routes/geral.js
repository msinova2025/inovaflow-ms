import express from 'express';
import { getGeral, updateGeral } from '../controllers/geralController.js';

const router = express.Router();

router.get('/', getGeral);
router.put('/:id', updateGeral);

export default router;
