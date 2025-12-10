// src/routes/article.route.js
import express from 'express';
import ArticleController from '../controllers/Article.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 
import { upload } from '../middleware/multer.middleware.js'; // Middleware Multer config memoryStorage

const router = express.Router();

// Cấu hình nhận file: 1 ảnh thumbnail + tối đa 10 ảnh chi tiết
const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// Route tạo bài viết (Cần login + upload ảnh)
router.post('/', protect, uploadFields, ArticleController.create);

// Route cập nhật bài viết
router.put('/:id', protect, uploadFields, ArticleController.update);

// Các route khác
router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.getOne);
router.delete('/:id', protect, ArticleController.delete);

export default router;