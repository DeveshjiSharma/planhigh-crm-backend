import { Router } from 'express';
import { getContacts, createContact } from '../controllers/contact';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getContacts);
router.post('/', authenticate, createContact);

export default router;
