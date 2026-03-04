import { Router } from 'express';
import { DictionaryController } from '../controllers/DictionaryController';
import { authenticateToken, authorizeEditor, authorizeAdmin } from '../middleware/auth';

const router = Router();
const controller = new DictionaryController();

// Rotas públicas
router.get('/', controller.list);

// Rotas protegidas
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorizeEditor, controller.create);
router.put('/:id', authenticateToken, authorizeEditor, controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;