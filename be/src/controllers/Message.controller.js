import MessageService from '../services/Message.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class MessageController {
  
  // Gửi tin nhắn mới
  create = asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      throw { message: "Thiếu thông tin cuộc hội thoại hoặc nội dung tin nhắn", statusCode: 400 };
    }

    // Payload gửi xuống service
    const messageData = {
      conversationId,
      sender: senderId,
      text
    };

    const result = await MessageService.create(messageData);
    successResponse(res, result, "Gửi tin nhắn thành công", 201);
  });

  // Lấy tin nhắn theo ID cuộc hội thoại
  getByConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    
    // Có thể thêm pagination (limit, page) nếu cần ở đây
    const result = await MessageService.getByConversation(conversationId);
    
    successResponse(res, result, "Lấy tin nhắn thành công");
  });

  // Xóa tin nhắn (nếu cần)
  delete = asyncHandler(async (req, res) => {
     const { id } = req.params;
     // Cần check quyền (chỉ người gửi mới được xóa) ở Service
     const result = await MessageService.delete(id, req.user.id);
     successResponse(res, result, "Xóa tin nhắn thành công");
  });
}

export default new MessageController();