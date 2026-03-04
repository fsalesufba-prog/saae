import { Router } from 'express';
import { ContractController } from '../controllers/ContractController';
import { authenticateToken, authorizeEditor, authorizeAdmin } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();
const controller = new ContractController();

// Rotas públicas
router.get('/', controller.list);
router.get('/:id', controller.getById);

// Rotas protegidas
router.post('/', authenticateToken, authorizeEditor, upload.single('document'), controller.create);
router.put('/:id', authenticateToken, authorizeEditor, upload.single('document'), controller.update);
router.delete('/:id', authenticateToken, authorizeAdmin, controller.delete);

export default router;