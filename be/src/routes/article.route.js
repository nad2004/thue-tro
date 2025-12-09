import express from 'express';
import ArticleController from '../controllers/Article.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();

// ✅ ĐÚNG: protect trước, authorize sau
router.post('/', protect, ArticleController.create);
router.get('/', ArticleController.getAll); // Public
router.get('/:id', ArticleController.getOne); // Public
router.put('/:id', protect,  ArticleController.update);
router.delete('/:id', protect, ArticleController.delete);

export default router;