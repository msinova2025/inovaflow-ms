import { authenticateToken } from '../middleware/auth.js';
import {
    getSolutionsByChallengeId,
    getSolutionById,
    createSolution,
    updateSolution,
    updateSolutionStatus,
    getSolutionStatuses,
    getAllSolutions,
    createSolutionStatus,
    updateSolutionStatusInfo,
    deleteSolutionStatus,
    getMySolutions
} from '../controllers/solutionController.js';

const router = express.Router();

router.get('/', getAllSolutions);
router.get('/my', authenticateToken, getMySolutions);
router.get('/challenge/:challengeId', getSolutionsByChallengeId);
router.get('/:id', getSolutionById);
router.post('/', createSolution);
router.put('/:id', updateSolution);
router.patch('/:id/status', updateSolutionStatus);
router.get('/statuses', getSolutionStatuses);
router.post('/statuses', createSolutionStatus);
router.put('/statuses/:id', updateSolutionStatusInfo);
router.delete('/statuses/:id', deleteSolutionStatus);

export default router;
