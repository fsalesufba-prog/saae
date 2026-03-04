import { Router } from 'express';
import { PhoneController } from '../controllers/PhoneController';
import { authenticateToken, authorizeEditor } from '../middleware/auth';

const router = Router();
const controller = new PhoneController();

// Rotas públicas
router.get('/', controller.list);

// Rotas protegidas
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorizeEditor, controller.create);
router.put('/:id', authenticateToken, authorizeEditor, controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;