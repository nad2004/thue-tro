// src/controllers/Message.controller.js
import MessageService from '../services/Message.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class MessageController {
  /**
   * Gửi tin nhắn mới (REST API)
   * Thường dùng Socket, nhưng có thể dùng REST làm fallback
   */
  create = asyncHandler(async (req, res) => {
    const senderID = req.user.id;
    const { conversationID, content, type } = req.body;

    if (!conversationID || !content) {
      throw { 
        message: 'Thiếu thông tin cuộc hội thoại hoặc nội dung tin nhắn', 
        statusCode: 400 
      };
    }

    const messageData = {
      conversationID,
      senderID,
      content,
      type: type || 'Text',
    };

    const result = await MessageService.create(messageData);
    successResponse(res, result, 'Gửi tin nhắn thành công', 201);
  });

  /**
   * Lấy tin nhắn theo conversationID
   * Support pagination
   */
  getByConversation = asyncHandler(async (req, res) => {
    const { conversationID } = req.params;
    const { page, limit } = req.query;

    const result = await MessageService.getByConversation(conversationID, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
    });

    successResponse(res, result, 'Lấy tin nhắn thành công');
  });

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  markAsRead = asyncHandler(async (req, res) => {
    const { conversationID } = req.params;
    const userID = req.user.id;

    const result = await MessageService.markAsRead(conversationID, userID);
    successResponse(res, result, 'Đã đánh dấu tin nhắn đã đọc');
  });

  /**
   * Xóa tin nhắn
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await MessageService.delete(id, req.user.id);
    successResponse(res, result, 'Xóa tin nhắn thành công');
  });
}

export default new MessageController();