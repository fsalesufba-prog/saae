import { Router } from 'express';
import { CipaController } from '../controllers/CipaController';
import { authenticateToken, authorizeEditor } from '../middleware/auth';

const router = Router();
const controller = new CipaController();

// Rotas públicas
router.get('/', controller.list);
router.get('/section/:section', controller.getBySection);

// Rotas protegidas
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorizeEditor, controller.create);
router.put('/:id', authenticateToken, authorizeEditor, controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;