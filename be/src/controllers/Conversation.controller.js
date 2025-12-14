import ConversationService from '../services/Conversation.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class ConversationController {
  // Tạo hoặc lấy cuộc hội thoại giữa buyer và owner
  createOrGet = asyncHandler(async (req, res) => {
    const { buyerID, ownerID } = req.body;

    if (!buyerID || !ownerID) {
      throw { message: 'Thiếu buyerID hoặc ownerID', statusCode: 400 };
    }

    const result = await ConversationService.createOrGet(buyerID, ownerID);
    successResponse(res, result, 'Lấy cuộc hội thoại thành công', 200);
  });

  // Lấy danh sách cuộc hội thoại của user hiện tại
  getUserConversations = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await ConversationService.getUserConversations(userId);
    successResponse(res, result, 'Lấy danh sách hội thoại thành công');
  });

  // Lấy chi tiết một cuộc hội thoại
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ConversationService.getById(id);

    if (!result) {
      throw { message: 'Không tìm thấy hội thoại', statusCode: 404 };
    }

    successResponse(res, result);
  });

  // Cập nhật unread count
  updateUnreadCount = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { count } = req.body;

    if (typeof count !== 'number') {
      throw { message: 'Count phải là số', statusCode: 400 };
    }

    const result = await ConversationService.updateUnreadCount(id, count);
    
    if (!result) {
      throw { message: 'Không tìm thấy hội thoại', statusCode: 404 };
    }

    successResponse(res, result, 'Cập nhật unread count thành công');
  });
}

export default new ConversationController();