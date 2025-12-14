// src/routes/message.routes.js
import express from 'express';
import MessageController from '../controllers/Message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

// Gửi tin nhắn mới (REST API - fallback)
router.post('/', MessageController.create);

// Lấy tất cả tin nhắn trong conversation (with pagination)
router.get('/conversation/:conversationID', MessageController.getByConversation);

// Đánh dấu tin nhắn đã đọc
router.patch('/conversation/:conversationID/read', MessageController.markAsRead);

// Xóa tin nhắn
router.delete('/:id', MessageController.delete);

export default router;