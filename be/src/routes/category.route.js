import express from 'express';
import CategoryController from '../controllers/Category.controller.js';
// import { protect, authorize } from '../middleware/auth.middleware.js'; // Giả định middleware

const router = express.Router();

router.post('/', CategoryController.create); // Thường yêu cầu protect + authorize(['Admin', 'Editor'])
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getOne);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;
