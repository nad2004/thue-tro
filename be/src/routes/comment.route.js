import express from 'express';
import CommentController from '../controllers/Comment.controller.js';
// import { protect } from '../middleware/auth.middleware.js'; // Cần protect cho delete

const router = express.Router();

// Lấy comment theo Article ID
router.get('/article/:articleId', CommentController.getByArticle);

// Tạo comment (không cần protect nếu cho phép ẩn danh, nhưng nên có Rate Limiter)
router.post('/', CommentController.create);

// Xóa comment (cần protect)
// router.delete('/:id', protect, CommentController.delete);

export default router;
