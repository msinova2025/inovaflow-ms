import express from 'express';
import { getContent, updateContent } from '../controllers/contentController.js';

const router = express.Router();

router.get('/:type', getContent);
router.put('/:type', updateContent);

export default router;
