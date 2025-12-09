import Conversation from '../models/Conversation.model.js';

export class ConversationService {

  // Tạo cuộc hội thoại mới hoặc lấy cái cũ nếu đã tồn tại
  async createOrGet(buyerID, ownerID, articleID) {
    let convo = await Conversation.findOne({ buyerID, ownerID, articleID });
    
    if (!convo) {
      convo = await Conversation.create({
        buyerID,
        ownerID,
        articleID,
        lastMessageSnippet: 'Bắt đầu cuộc trò chuyện',
        unreadCount: 0
      });
    }
    return convo;
  }

  // Lấy danh sách chat của một User (dù họ là người thuê hay chủ nhà)
  async getUserConversations(userID) {
    return await Conversation.find({
      $or: [{ buyerID: userID }, { ownerID: userID }]
    })
    .populate('buyerID', 'fullName avatar')
    .populate('ownerID', 'fullName avatar')
    .populate('articleID', 'title thumbnail price') // Hiển thị ảnh phòng trong list chat
    .sort({ lastMessageTime: -1 }); // Chat mới nhất lên đầu
  }
}

export default new ConversationService();