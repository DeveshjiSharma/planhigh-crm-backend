import { Router } from 'express';
import { getStats, getGraphData, getActivity } from '../controllers/dashboard';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, getStats);
router.get('/graph', authenticate, getGraphData);
router.get('/activity', authenticate, getActivity);

export default router;
