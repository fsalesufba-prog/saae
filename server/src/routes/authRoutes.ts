import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login);
router.post('/logout', authenticateToken, controller.logout);
router.get('/me', authenticateToken, controller.me);

export default router;