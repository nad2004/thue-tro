import Comment from '../models/Comment.model.js';

export class CommentService {
  
  async create(data) {
    // data: articleID, userID, type ('Saved', 'Booking'), content
    
    // Nếu là 'Saved' (Lưu tin), kiểm tra xem đã lưu chưa để tránh trùng
    if (data.type === 'Saved') {
        const exists = await Comment.findOne({ 
            articleID: data.articleID, 
            userID: data.userID, 
            type: 'Saved' 
        });
        if (exists) return exists; // Đã lưu rồi thì trả về luôn
    }

    const newInteraction = new Comment(data);
    await newInteraction.save();
    return newInteraction;
  }

  // Lấy danh sách tin đã lưu của user
  async getSavedArticles(userID) {
    return await Comment.find({ userID, type: 'Saved' })
      .populate({
        path: 'articleID',
        select: 'title price area thumbnail address', // Chỉ lấy thông tin cần thiết để hiển thị list
        populate: { path: 'categoryID', select: 'categoryName' }
      });
  }

  // Lấy danh sách khách đặt lịch cho một bài đăng (Dành cho chủ nhà)
  async getBookingsForArticle(articleID) {
    return await Comment.find({ articleID, type: 'Booking' })
      .populate('userID', 'fullName phoneNumber email')
      .sort({ createdAt: -1 });
  }

  async delete(id) {
     // Xóa (Bỏ lưu tin)
     return await Comment.findByIdAndDelete(id);
  }
}

export default new CommentService();