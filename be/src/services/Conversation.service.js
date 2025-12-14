// src/services/Conversation.service.js
import Conversation from '../models/Conversation.model.js';

export class ConversationService {
  /**
   * Tạo cuộc hội thoại mới hoặc lấy cái cũ nếu đã tồn tại
   */
  async createOrGet(buyerID, ownerID) {
    let convo = await Conversation.findOne({ buyerID, ownerID });

    if (!convo) {
      convo = await Conversation.create({
        buyerID,
        ownerID,
        lastMessageSnippet: '',
        unreadCount: 0,
      });
      console.log(`[Service] Created new conversation: ${convo._id}`);
    }

    return convo;
  }

  /**
   * Lấy danh sách chat của một User (dù họ là người thuê hay chủ nhà)
   */
  async getUserConversations(userID) {
    return await Conversation.find({
      $or: [{ buyerID: userID }, { ownerID: userID }],
    })
      .populate('buyerID', 'fullName avatar')
      .populate('ownerID', 'fullName avatar')
      .sort({ lastMessageTime: -1 }) // Chat mới nhất lên đầu
      .lean();
  }

  /**
   * Lấy chi tiết một conversation
   */
  async getById(conversationID) {
    return await Conversation.findById(conversationID)
      .populate('buyerID', 'fullName avatar email phoneNumber')
      .populate('ownerID', 'fullName avatar email phoneNumber')
      .lean();
  }

  /**
   * Cập nhật unread count
   */
  async updateUnreadCount(conversationID, count) {
    return await Conversation.findByIdAndUpdate(
      conversationID,
      { unreadCount: count },
      { new: true }
    );
  }
}

export default new ConversationService();