// src/routes/article.route.js
import express from 'express';
import ArticleController from '../controllers/Article.controller.js';
import { protect, authorize, protectOptional } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

// Cấu hình Multer: 1 ảnh thumbnail + tối đa 10 ảnh chi tiết
const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

// --- PUBLIC ROUTES (Ai cũng xem được) ---
router.get('/', protectOptional, ArticleController.getAll);
router.get('/:id', protectOptional, ArticleController.getOne);
router.get(
  '/my-articles',
  protect,
  authorize('Admin', 'Landlord'),
  ArticleController.getMyArticles,
);

router.post('/', protect, authorize('Admin', 'Landlord'), uploadFields, ArticleController.create);
router.put('/:id', protect, authorize('Admin', 'Landlord'), uploadFields, ArticleController.update);
router.delete('/:id', protect, authorize('Admin', 'Landlord'), ArticleController.delete);
router.patch('/:id/approve', protect, authorize('Admin'), ArticleController.approve);

export default router;
