import { Router } from 'express';
import { WaterQualityController } from '../controllers/WaterQualityController';
import { authenticateToken, authorizeEditor } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new WaterQualityController();

// Rotas públicas
router.get('/', controller.list);
router.get('/:id', controller.getById);

// Rotas protegidas
router.post('/', authenticateToken, authorizeEditor, upload.single('file'), controller.create);
router.put('/:id', authenticateToken, authorizeEditor, upload.single('file'), controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;