// src/services/Article.service.js
import Article from '../models/Article.model.js';
import User from '../models/User.model.js';
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
  async getAll(query, currentUserID) {
    const {
      search,
      categoryID,
      tags,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      page = 1,
      limit = 10,
      sort = 'newest',
      status,
    } = query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    // Tìm kiếm
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ title: searchRegex }, { summary: searchRegex }];
    }

    if (categoryID) filter.categoryID = categoryID;

    // Lọc theo Tags - đã được xử lý thành array ở controller
    if (tags && Array.isArray(tags) && tags.length > 0) {
      filter.tags = { $in: tags }; // Dùng $in thay vì $all để linh hoạt hơn
      // Hoặc dùng $all nếu muốn match tất cả tags: filter.tags = { $all: tags };
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

    // Phân trang & Sắp xếp
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    // Lấy danh sách liked articles (nếu có user)
    let likedArticleIds = [];
    if (currentUserID) {
      try {
        const currentUser = await User.findById(currentUserID).select('savedArticles');
        if (currentUser && currentUser.savedArticles) {
          likedArticleIds = currentUser.savedArticles.map((id) => id.toString());
        }
      } catch (error) {
        console.error('Error fetching user saved articles:', error);
      }
    }

    // Query Database
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('authorID', 'fullName avatar phoneNumber email')
        .populate('categoryID', 'categoryName')
        .populate('tags', 'tagName tagType')
        .select('-content')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Article.countDocuments(filter),
    ]);

    // Map articles với isLiked
    const data = articles.map((article) => ({
      ...article,
      isLiked: currentUserID ? likedArticleIds.includes(article._id.toString()) : false,
    }));

    return {
      data: data,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  // --- LẤY BÀI VIẾT CỦA TÔI ---
  async getMyArticles(userID, query) {
    const { search, page = 1, limit = 10, sort = 'newest', status } = query;

    const filter = { authorID: userID };

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ title: searchRegex }, { summary: searchRegex }];
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    // FIX: Lấy liked articles
    let likedArticleIds = [];
    try {
      const currentUser = await User.findById(userID).select('savedArticles');
      if (currentUser && currentUser.savedArticles) {
        likedArticleIds = currentUser.savedArticles.map((id) => id.toString());
      }
    } catch (error) {
      console.error('Error fetching user saved articles:', error);
    }

    // Query
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('categoryID', 'categoryName')
        .populate('tags', 'tagName tagType')
        .select('-content')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Article.countDocuments(filter),
    ]);

    // FIX: Map với isLiked
    const data = articles.map((article) => ({
      ...article,
      isLiked: likedArticleIds.includes(article._id.toString()),
    }));

    return {
      data: data,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  // --- LẤY CHI TIẾT ---
  async getById(id, currentUserID) {
    const article = await Article.findById(id)
      .populate('authorID', 'fullName phoneNumber avatar email')
      .populate('categoryID', 'categoryName parentCategory')
      .populate('tags')
      .lean();

    if (!article) throw new Error('Không tìm thấy tin đăng.');

    let isLiked = false;
    if (currentUserID) {
      try {
        const user = await User.findById(currentUserID).select('savedArticles');
        if (user && user.savedArticles && user.savedArticles.includes(id)) {
          isLiked = true;
        }
      } catch (error) {
        console.error('Error checking if article is liked:', error);
        // isLiked tetap false
      }
    }

    return { ...article, isLiked };
  }

  // --- CẬP NHẬT ---
  async update(id, data, userID, userRole) {
    const article = await Article.findById(id);
    if (!article) throw new Error('Tin không tồn tại');

    // Check quyền
    if (article.authorID.toString() !== userID && userRole !== 'Admin') {
      throw new Error('Bạn không có quyền sửa tin này');
    }

    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const updated = await Article.findByIdAndUpdate(id, data, { new: true });
    return updated;
  }

  // --- DUYỆT BÀI (ADMIN) ---
  async approve(id) {
    const article = await Article.findById(id);
    if (!article) throw new Error('Tin đăng không tồn tại');

    if (article.status === 'Published') {
      throw new Error('Tin này đã được duyệt trước đó');
    }

    article.status = 'Published';
    await article.save();
    return article;
  }

  // --- XÓA BÀI ---
  async delete(id) {
    const result = await Article.findByIdAndDelete(id);
    if (!result) throw new Error('Không tìm thấy bài viết để xóa.');
    return { message: 'Đã xóa bài viết thành công', id: result._id };
  }
}

export default new ArticleService();
