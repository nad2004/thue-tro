// src/services/Message.service.js
import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';

export class MessageService {
  /**
   * Lấy tất cả tin nhắn theo conversationID
   * Support pagination
   */
  async getByConversation(conversationID, options = {}) {
    // Nếu FE không gửi limit thì mặc định lấy 20 tin, page mặc định là 1
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // 1. Lấy tổng số tin nhắn để tính toán phân trang
    const total = await Message.countDocuments({ conversationID });

    // 2. Query tin nhắn
    const messages = await Message.find({ conversationID })
      .populate('senderID', 'fullName avatar email')
      .sort({ createdAt: -1 }) // QUAN TRỌNG: Lấy tin mới nhất trước (DESC)
      .skip(skip)
      .limit(limit)
      .lean();

    // 3. Đảo ngược lại mảng kết quả để FE hiển thị từ trên xuống dưới (Cũ -> Mới)
    // Vì user đọc từ trên xuống, nên tin nhắn cũ nhất trong trang này phải nằm trên cùng
    const sortedMessages = messages.reverse();

    return {
      data: sortedMessages,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Tạo tin nhắn mới (sử dụng qua REST API, không phải Socket)
   */
  async create(messageData) {
    const { conversationID, senderID, content, type = 'Text' } = messageData;

    // Tạo message
    const newMessage = new Message({
      conversationID,
      senderID,
      content,
      type,
      isRead: false,
    });

    const savedMessage = await newMessage.save();
    await savedMessage.populate('senderID', 'fullName avatar');

    // Cập nhật conversation
    await Conversation.findByIdAndUpdate(conversationID, {
      lastMessageSnippet: type === 'Image' ? '[Hình ảnh]' : content,
      lastMessageTime: new Date(),
      $inc: { unreadCount: 1 },
    });

    return savedMessage;
  }

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  async markAsRead(conversationID, userID) {
    // Đánh dấu tất cả tin nhắn trong conversation mà user là người nhận
    await Message.updateMany(
      {
        conversationID,
        senderID: { $ne: userID }, // Không phải tin nhắn của mình
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    // Reset unread count
    await Conversation.findByIdAndUpdate(conversationID, {
      unreadCount: 0,
    });

    return { success: true };
  }

  /**
   * Xóa tin nhắn (chỉ người gửi mới được xóa)
   */
  async delete(messageID, userID) {
    const message = await Message.findById(messageID);

    if (!message) {
      throw new Error('Tin nhắn không tồn tại');
    }

    // Kiểm tra quyền
    if (message.senderID.toString() !== userID) {
      throw new Error('Bạn không có quyền xóa tin nhắn này');
    }

    await Message.findByIdAndDelete(messageID);

    return { success: true, message: 'Đã xóa tin nhắn' };
  }
}

export default new MessageService();