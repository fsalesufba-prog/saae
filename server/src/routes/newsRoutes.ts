import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';
import { authenticateToken, authorizeEditor } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new NewsController();

// Rotas públicas
router.get('/', controller.list);
router.get('/slug/:slug', controller.getBySlug);

// Rotas protegidas
router.get('/:id', authenticateToken, controller.getById);
router.post('/', authenticateToken, authorizeEditor, upload.single('image'), controller.create);
router.put('/:id', authenticateToken, authorizeEditor, upload.single('image'), controller.update);
router.delete('/:id', authenticateToken, authorizeEditor, controller.delete);
router.patch('/:id', authenticateToken, authorizeEditor, controller.togglePublish);

export default router;