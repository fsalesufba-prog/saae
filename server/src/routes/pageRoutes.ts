import { Router } from 'express';
import { PageController } from '../controllers/PageController';
import { authenticateToken, authorizeEditor } from '../middleware/auth';

const router = Router();
const controller = new PageController();

// Rotas públicas
router.get('/', controller.list);
router.get('/slug/:slug', controller.getBySlug);

// Rotas protegidas
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorizeEditor, controller.create);
router.put('/:id', authenticateToken, authorizeEditor, controller.update);
router.patch('/:id', authenticateToken, authorizeEditor, controller.togglePublish);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;