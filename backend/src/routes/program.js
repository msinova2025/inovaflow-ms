import express from 'express';
import { getAllProgramInfo, createProgramInfo, updateProgramInfo, deleteProgramInfo } from '../controllers/programController.js';

const router = express.Router();

router.get('/', getAllProgramInfo);
router.post('/', createProgramInfo);
router.put('/:id', updateProgramInfo);
router.delete('/:id', deleteProgramInfo);

export default router;
