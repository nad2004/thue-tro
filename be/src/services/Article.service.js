// src/services/Article.service.js
import Article from '../models/Article.model.js';
import slugify from 'slugify';

export class ArticleService {
  
  // --- TẠO BÀI VIẾT ---
  async create(data) {
    if (!data.slug && data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }
    
    const newArticle = new Article(data);
    await newArticle.save();
    return newArticle;
  }

  // --- LẤY DANH SÁCH (FILTER, SEARCH, PAGINATION) ---
  async getAll(query) {
    // 1. Lấy tham số từ Query String & Set mặc định
    const { 
        search, 
        categoryID, 
        tags, 
        minPrice, maxPrice, 
        minArea, maxArea, 
        page = 1, 
        limit = 10, 
        sort = 'newest', // Các giá trị: newest, oldest, price-asc, price-desc
        status = 'Published' 
    } = query;

    // 2. Xây dựng bộ lọc (Filter Object)
    const filter = { status }; // Mặc định chỉ lấy tin đã Published

    // a. Tìm kiếm từ khóa (Search)
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // 'i' để không phân biệt hoa thường
        filter.$or = [
            { title: searchRegex },
            { summary: searchRegex }
        ];
    }

    // b. Lọc theo Danh mục
    if (categoryID) {
        filter.categoryID = categoryID;
    }

    // c. Lọc theo Tags (Tiện ích)
    // URL dạng: ?tags=id1&tags=id2 (Mảng) hoặc ?tags=id1 (String)
    if (tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        if (tagList.length > 0) {
            // $all: Bài viết phải có ĐỦ các tags này
            filter.tags = { $all: tagList };
        }
    }

    // d. Lọc theo Giá (Chuyển sang Number để so sánh đúng)
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // e. Lọc theo Diện tích
    if (minArea || maxArea) {
        filter.area = {};
        if (minArea) filter.area.$gte = Number(minArea);
        if (maxArea) filter.area.$lte = Number(maxArea);
    }

    // 3. Xử lý Phân trang & Sắp xếp
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 }; // Mặc định: Mới nhất trước
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-asc') sortOption = { price: 1 };     // Giá thấp -> cao
    if (sort === 'price-desc') sortOption = { price: -1 };   // Giá cao -> thấp

    // 4. Thực thi Query (Dùng Promise.all để chạy song song count và find)
    const [articles, total] = await Promise.all([
        Article.find(filter)
            .populate('authorID', 'fullName avatar phoneNumber') // Info người đăng
            .populate('categoryID', 'categoryName')             // Info danh mục
            .populate('tags', 'tagName tagType')                // Info tiện ích
            .select('-content')                                 // Bỏ nội dung dài để API nhẹ hơn
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber),
        Article.countDocuments(filter) // Đếm tổng số bản ghi thỏa mãn filter
    ]);

    // 5. Trả về kết quả chuẩn format Pagination
    return {
        data: articles,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber)
        }
    };
  }

  // --- LẤY CHI TIẾT 1 BÀI ---
  async getById(id) {
    const article = await Article.findById(id)
      .populate('authorID', 'fullName phoneNumber avatar email')
      .populate('categoryID', 'categoryName parentCategory')
      .populate('tags'); // Lấy full thông tin tags

    if (!article) throw new Error("Không tìm thấy tin đăng.");
    
    return article;
  }

  // --- CẬP NHẬT BÀI VIẾT ---
  async update(id, data, userID, userRole) {
    const article = await Article.findById(id);
    if (!article) throw new Error("Tin không tồn tại");

    // Check quyền: Chỉ chủ bài viết hoặc Admin mới được sửa
    if (article.authorID.toString() !== userID && userRole !== 'Admin') {
        throw new Error("Bạn không có quyền sửa tin này");
    }

    // Nếu sửa title thì update lại slug
    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const updated = await Article.findByIdAndUpdate(id, data, { new: true });
    return updated;
  }

  // --- XÓA BÀI VIẾT ---
  async delete(id) {
    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Không tìm thấy bài viết để xóa.");
    }
    // Note: Có thể cần xóa thêm Comment liên quan nếu có logic đó
    return { message: "Đã xóa bài viết thành công", id: result._id };
  }
}

export default new ArticleService();