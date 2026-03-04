import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();
const controller = new UserController();

router.get('/', authenticateToken, authorizeAdmin, controller.list);
router.get('/:id', authenticateToken, authorizeAdmin, controller.getById);
router.post('/', authenticateToken, authorizeAdmin, controller.create);
router.put('/:id', authenticateToken, authorizeAdmin, controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;