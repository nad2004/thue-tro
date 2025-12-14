import express from 'express';
import ConversationController from '../controllers/Conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả các route chat đều cần đăng nhập
router.use(protect);

// Tạo hoặc lấy conversation giữa buyer và owner
router.post('/create-or-get', ConversationController.createOrGet);

// Lấy danh sách conversations của user hiện tại
router.get('/', ConversationController.getUserConversations);

// Lấy chi tiết một conversation
router.get('/:id', ConversationController.getById);

// Cập nhật unread count
router.patch('/:id/unread', ConversationController.updateUnreadCount);

export default router;