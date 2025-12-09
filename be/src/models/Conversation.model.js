import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  buyerID: {
    type: mongoose.Schema.Types.ObjectId, // Người đi thuê
    ref: 'User',
    required: true,
  },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId, // Chủ nhà
    ref: 'User',
    required: true,
  },
  articleID: {
    type: mongoose.Schema.Types.ObjectId, // Chat về phòng nào
    ref: 'Article',
    required: true,
  },
  lastMessageSnippet: {
    type: String, // "Dạ phòng còn không ạ..."
    default: '',
  },
  lastMessageTime: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Đảm bảo mỗi cặp User chỉ có 1 cuộc hội thoại về 1 bài đăng cụ thể (opsional)
ConversationSchema.index({ buyerID: 1, ownerID: 1, articleID: 1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;