import mongoose from 'mongoose';
import slugify from 'slugify';

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String, // Ví dụ: "Phòng trọ 25m2 full đồ..."
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String, // Mô tả chi tiết
    required: true,
  },
  summary: {
    type: String, // Đóng vai trò là "Địa chỉ hiển thị ngắn gọn"
    required: true,
  },
  price: {
    type: Number, // Giá tiền (VND)
    required: true,
    index: true, // Đánh index để lọc giá nhanh hơn
  },
  area: {
    type: Number, // Diện tích (m2)
    required: true,
  },
  thumbnail: {
    type: String, // Link ảnh đại diện tin
    required: true,
  },
  images: [{
    type: String // Mảng chứa các ảnh chi tiết khác (nếu cần)
  }],
  categoryID: {
    type: mongoose.Schema.Types.ObjectId, // Thuộc Quận/Huyện nào
    ref: 'Category',
    required: true,
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId, // Ai đăng tin (Chủ nhà)
    ref: 'User',
    required: true,
  },
  tags: [{ 
    type: mongoose.Schema.Types.ObjectId, // Các tiện ích đi kèm (Thay thế file ArticleTag)
    ref: 'Tag' 
  }],
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Published', 'Hidden', 'Rented'], // Thêm 'Rented' (Đã thuê)
    default: 'Pending', // Mặc định chờ duyệt
  }
}, { timestamps: true });

ArticleSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

const Article = mongoose.model('Article', ArticleSchema);
export default Article;