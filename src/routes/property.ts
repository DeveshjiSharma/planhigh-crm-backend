import { Router } from 'express';
import { getProperties, getProperty, createProperty } from '../controllers/property';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProperties);
router.get('/:id', authenticate, getProperty);
router.post('/', authenticate, authorize(['admin', 'agent']), createProperty);

export default router;
