import { Router } from 'express';
import { CarouselController } from '../controllers/CarouselController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new CarouselController();

router.get('/', controller.list);
router.get('/active', controller.listActive);
router.get('/:id', controller.getById);
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), controller.create);
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);
router.post('/:id/move-up', authenticateToken, authorizeAdmin, controller.moveUp);
router.post('/:id/move-down', authenticateToken, authorizeAdmin, controller.moveDown);

export default router;