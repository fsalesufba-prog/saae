import { Router } from 'express';
import { GalleryController } from '../controllers/GalleryController';
import { authenticateToken, authorizeAdmin, authorizeEditor } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new GalleryController();

// Rotas públicas
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.get('/:id/media', controller.getMedia);

// Rotas protegidas
router.post('/', authenticateToken, authorizeEditor, upload.single('cover'), controller.create);
router.put('/:id', authenticateToken, authorizeEditor, upload.single('cover'), controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);
router.post('/:id/media', authenticateToken, authorizeEditor, upload.array('files', 20), controller.addMedia);
router.put('/:id/media/:mediaId', authenticateToken, authorizeEditor, controller.updateMedia);
router.delete('/:id/media/:mediaId', authenticateToken, authorizeEditor, controller.deleteMedia);
router.post('/:id/media/:mediaId/:direction', authenticateToken, authorizeEditor, controller.moveMedia);

export default router;