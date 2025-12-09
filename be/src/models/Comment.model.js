import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Saved', 'Call_Click', 'Booking'], // Lưu tin, Bấm gọi, Đặt lịch
    required: true,
  },
  content: {
    type: String, // Nếu là Booking thì lưu: "Mình muốn xem phòng lúc 5h chiều"
    default: '',
  },
  guestName: {
     type: String, // Trường hợp khách vãng lai (nếu cần)
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;