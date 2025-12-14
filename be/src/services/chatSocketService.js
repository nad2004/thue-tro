import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';

export const chatSocketService = (io, socket) => {

  /**
   * 1. START CONVERSATION (Get or Create)
   * Được gọi khi user bấm nút "Nhắn tin" từ trang Profile hoặc trang Bài đăng.
   * Logic: Kiểm tra xem 2 người đã có hội thoại chưa. Nếu chưa -> Tạo mới.
   */
  socket.on('start_conversation', async (payload, callback) => {
    const { buyerID, ownerID } = payload;

    try {
      // Tìm hội thoại giữa buyer và owner
      let conversation = await Conversation.findOne({ buyerID, ownerID });

      // Nếu chưa có -> Tạo mới
      if (!conversation) {
        conversation = new Conversation({
          buyerID,
          ownerID,
          lastMessageSnippet: '',
          unreadCount: 0
        });
        await conversation.save();
        console.log(`[Socket] Tạo mới Conversation: ${conversation._id}`);
      }

      // Join socket vào phòng này
      const conversationID = conversation._id.toString();
      socket.join(conversationID);

      // Trả về info phòng chat để Client chuyển trang hoặc hiển thị khung chat
      if (callback) {
        callback({
          status: 'ok',
          data: conversation
        });
      }

    } catch (error) {
      console.error('[Socket] Lỗi start_conversation:', error);
      if (callback) callback({ status: 'error', message: 'Lỗi server khi tạo phòng' });
    }
  });

  /**
   * 2. JOIN CONVERSATION
   * Được gọi khi user bấm vào 1 dòng trong danh sách tin nhắn (Inbox).
   */
  socket.on('join_conversation', (conversationID) => {
    socket.join(conversationID);
    console.log(`[Socket] User ${socket.id} joined room: ${conversationID}`);
    
    // (Optional) Reset unreadCount khi join nếu muốn
    // await Conversation.findByIdAndUpdate(conversationID, { unreadCount: 0 });
  });

  /**
   * 3. LEAVE CONVERSATION
   */
  socket.on('leave_conversation', (conversationID) => {
    socket.leave(conversationID);
  });

  /**
   * 4. SEND MESSAGE
   * Gửi tin nhắn và cập nhật trạng thái Conversation
   */
  socket.on('send_message', async (payload, callback) => {
    const { conversationID, senderID, content, type = 'Text' } = payload;

    try {
      // A. Tạo Message mới
      const newMessage = new Message({
        conversationID,
        senderID,
        content,
        type,
        isRead: false
      });

      const savedMessage = await newMessage.save();
      // Populate thông tin người gửi để Client hiển thị avatar/tên ngay
      await savedMessage.populate('senderID', 'fullName avatar');

      await Conversation.findByIdAndUpdate(conversationID, {
        lastMessageSnippet: type === 'Image' ? '[Hình ảnh]' : content,
        lastMessageTime: new Date(),
        $inc: { unreadCount: 1 }
      });

      // C. Gửi Realtime cho người nhận (người kia trong phòng)
      socket.to(conversationID).emit('receive_message', savedMessage);

      // D. Callback phản hồi cho người gửi (để cập nhật UI phía sender)
      if (callback) {
        callback({
          status: 'ok',
          data: savedMessage
        });
      }

    } catch (error) {
      console.error('[Socket] Lỗi send_message:', error);
      if (callback) {
        callback({ status: 'error', message: 'Không thể gửi tin nhắn' });
      }
    }
  });

  /**
   * 5. TYPING INDICATOR
   */
  socket.on('typing_start', (conversationID) => {
    socket.to(conversationID).emit('typing_signal', { 
      conversationID, 
      isTyping: true,
      senderID: socket.userId // ID từ lúc handshake (nếu có set)
    });
  });

  socket.on('typing_stop', (conversationID) => {
    socket.to(conversationID).emit('typing_signal', { 
      conversationID, 
      isTyping: false 
    });
  });
};