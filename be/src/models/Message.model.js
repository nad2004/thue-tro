import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true, // Index để load tin nhắn của hội thoại nhanh
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId, // Ai gửi?
      ref: 'User',
      required: true,
    },
    content: {
      type: String, // Nội dung tin nhắn
      required: true,
    },
    type: {
      type: String,
      enum: ['Text', 'Image', 'Location'],
      default: 'Text',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
); // createdAt sẽ đóng vai trò là SentAt

const Message = mongoose.model('Message', MessageSchema);
export default Message;
