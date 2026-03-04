import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';

const router = Router();
const controller = new ContactController();

router.post('/', controller.send);

export default router;