import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new SettingsController();

// Rotas públicas
router.get('/comunicado', controller.getComunicado);

// Rotas protegidas
router.get('/', authenticateToken, authorizeAdmin, controller.getAll);
router.get('/stats', authenticateToken, authorizeAdmin, controller.getStats);
router.get('/:key', authenticateToken, authorizeAdmin, controller.getByKey);
router.post('/', authenticateToken, authorizeAdmin, upload.single('comunicado'), controller.update);

export default router;