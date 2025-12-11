// src/services/Article.service.js
import Article from '../models/Article.model.js';
import slugify from 'slugify';

export class ArticleService {
  
  // --- TẠO BÀI VIẾT ---
  async create(data) {
    if (!data.slug && data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }
    
    // data lúc này đã có link ảnh (thumbnail, images) do Controller xử lý
    const newArticle = new Article(data);
    await newArticle.save();
    return newArticle;
  }

  // --- LẤY DANH SÁCH (FILTER, SEARCH, PAGINATION) ---
  async getAll(query) {
    const { 
        search, 
        categoryID, 
        tags, 
        minPrice, maxPrice, 
        minArea, maxArea, 
        page = 1, 
        limit = 10, 
        sort = 'newest', // newest | oldest | price-asc | price-desc
        status, // Mặc định chỉ lấy tin đã duyệt
    } = query;
    const filter = {}; // Khởi tạo rỗng để lấy tất cả

    if (status) {
        filter.status = status;
    }
    // Tìm kiếm (Title hoặc Summary/Address)
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { title: searchRegex },
            { summary: searchRegex }
        ];
    }

    if (categoryID) filter.categoryID = categoryID;

    // Lọc theo Tags (Tiện ích) - URL dạng ?tags=id1&tags=id2
    if (tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        if (tagList.length > 0) {
            filter.tags = { $all: tagList }; // Bài viết phải có đủ các tags này
        }
    }

    // Lọc theo Giá
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Lọc theo Diện tích
    if (minArea || maxArea) {
        filter.area = {};
        if (minArea) filter.area.$gte = Number(minArea);
        if (maxArea) filter.area.$lte = Number(maxArea);
    }

    // 2. Phân trang & Sắp xếp
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 }; // Mặc định mới nhất
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    // 3. Query Database
    const [articles, total] = await Promise.all([
        Article.find(filter)
            .populate('authorID', 'fullName avatar phoneNumber email')
            .populate('categoryID', 'categoryName')
            .populate('tags', 'tagName tagType')
            .select('-content') // Bỏ nội dung dài cho nhẹ
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber),
        Article.countDocuments(filter)
    ]);

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
  async getMyArticles(userID, query) {
    const { 
        search, 
        page = 1, 
        limit = 10, 
        sort = 'newest', 
        status 
    } = query;

    // 1. BẮT BUỘC lọc theo tác giả là userID truyền vào
    const filter = { authorID: userID };
    if (status) {
        filter.status = status;
    }
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { title: searchRegex },
            { summary: searchRegex }
        ];
    }
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    // 5. Query
    const [articles, total] = await Promise.all([
        Article.find(filter)
            .populate('categoryID', 'categoryName')
            .populate('tags', 'tagName tagType')
            .select('-content') // Bỏ nội dung dài
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber),
        Article.countDocuments(filter)
    ]);

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
  // --- LẤY CHI TIẾT ---
  async getById(id) {
    const article = await Article.findById(id)
      .populate('authorID', 'fullName phoneNumber avatar email')
      .populate('categoryID', 'categoryName parentCategory')
      .populate('tags');

    if (!article) throw new Error("Không tìm thấy tin đăng.");
    return article;
  }

  // --- CẬP NHẬT ---
  async update(id, data, userID, userRole) {
    const article = await Article.findById(id);
    if (!article) throw new Error("Tin không tồn tại");

    // Check quyền: Chỉ chủ bài viết hoặc Admin mới được sửa
    if (article.authorID.toString() !== userID && userRole !== 'Admin') {
        throw new Error("Bạn không có quyền sửa tin này");
    }

    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }

    // Nếu muốn đổi trạng thái về Pending khi sửa tin đã duyệt, thêm logic ở đây
    // if (article.status === 'Published' && userRole !== 'Admin') data.status = 'Pending';

    const updated = await Article.findByIdAndUpdate(id, data, { new: true });
    return updated;
  }

  // --- DUYỆT BÀI (ADMIN) ---
  async approve(id) {
    const article = await Article.findById(id);
    if (!article) throw new Error("Tin đăng không tồn tại");

    if (article.status === 'Published') {
        throw new Error("Tin này đã được duyệt trước đó");
    }

    article.status = 'Published';
    await article.save();
    return article;
  }

  // --- XÓA BÀI ---
  async delete(id) {
    const result = await Article.findByIdAndDelete(id);
    if (!result) throw new Error("Không tìm thấy bài viết để xóa.");
    return { message: "Đã xóa bài viết thành công", id: result._id };
  }
}

export default new ArticleService();