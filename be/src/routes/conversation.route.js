import express from 'express';
import ConversationController from '../controllers/Conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Giả định tên hàm middleware của bạn

const router = express.Router();

// Tất cả các route chat đều cần đăng nhập
router.use(protect);

router.post('/', ConversationController.create);
router.get('/', ConversationController.getQueryParams); // Lấy list chat của user
router.get('/:id', ConversationController.getOne);

export default router;
