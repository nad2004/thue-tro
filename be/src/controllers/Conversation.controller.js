import ConversationService from '../services/Conversation.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class ConversationController {
  
  // Tạo cuộc hội thoại mới (giữa user đang login và receiverId)
  create = asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      throw { message: "Thiếu ID người nhận", statusCode: 400 };
    }

    const result = await ConversationService.create(senderId, receiverId);
    successResponse(res, result, "Tạo cuộc hội thoại thành công", 201);
  });

  // Lấy danh sách cuộc hội thoại của user hiện tại
  getQueryParams = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await ConversationService.getByUser(userId);
    successResponse(res, result, "Lấy danh sách hội thoại thành công");
  });

  // Lấy chi tiết một cuộc hội thoại (tuỳ chọn, nếu cần check members)
  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ConversationService.getById(id);
    
    if (!result) throw { message: "Không tìm thấy hội thoại", statusCode: 404 };
    
    successResponse(res, result);
  });
}

export default new ConversationController();