import Article from '../models/Article.model.js';
import slugify from 'slugify';

export class ArticleService {
  
  async create(data) {
    // data bao gồm: title, price, area, tags (array IDs), images, v.v.
    if (!data.slug && data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }
    
    // Tạo tin đăng mới
    const newArticle = new Article(data);
    await newArticle.save();
    return newArticle;
  }

  /**
   * Tìm kiếm nâng cao cho bất động sản
   */
  async getAll({ 
    categoryID, 
    minPrice, maxPrice, 
    minArea, maxArea, 
    tags, // Mảng các tagID (VD: Tìm phòng có Điều hòa AND Nóng lạnh)
    status = 'Published', 
    limit = 10, skip = 0 
  }) {
    const filter = { status };

    // 1. Lọc theo khu vực
    if (categoryID) filter.categoryID = categoryID;

    // 2. Lọc theo khoảng giá
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }

    // 3. Lọc theo diện tích
    if (minArea || maxArea) {
        filter.area = {};
        if (minArea) filter.area.$gte = minArea;
        if (maxArea) filter.area.$lte = maxArea;
    }

    // 4. Lọc theo tiện ích (Tìm bài viết chứa TẤT CẢ các tags được chọn)
    if (tags && tags.length > 0) {
        filter.tags = { $all: tags }; 
    }

    // Query
    const articles = await Article.find(filter)
      .populate('authorID', 'fullName avatar phoneNumber') // Hiển thị info chủ nhà ngay ở card
      .populate('categoryID', 'categoryName')
      .populate('tags', 'tagName tagType') // Hiển thị tiện ích
      .select('-content') // Không lấy nội dung chi tiết khi view list để nhẹ
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Tin mới nhất lên đầu

    const total = await Article.countDocuments(filter);

    return { data: articles, total, page: Math.floor(skip/limit) + 1 };
  }

  async getById(id) {
    const article = await Article.findById(id)
      .populate('authorID', 'fullName phoneNumber avatar email')
      .populate('categoryID', 'categoryName parentCategory')
      .populate('tags'); // Lấy full tags

    if (!article) throw new Error("Không tìm thấy tin đăng.");
    
    // Tăng view nếu cần thiết ở đây
    return article;
  }

  async update(id, data, userID, userRole) {
    const article = await Article.findById(id);
    if (!article) throw new Error("Tin không tồn tại");

    // Check quyền: Chỉ chủ bài viết hoặc Admin mới được sửa
    if (article.authorID.toString() !== userID && userRole !== 'Admin') {
        throw new Error("Không có quyền sửa tin này");
    }

    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const updated = await Article.findByIdAndUpdate(id, data, { new: true });
    return updated;
  }
  async delete(id) {
    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Không tìm thấy bài viết để xóa.");
    }
    // TODO: Xóa các Comment và ArticleTag liên quan
    return { message: "Đã xóa bài viết thành công", id: result._id };
  }
}

export default new ArticleService();