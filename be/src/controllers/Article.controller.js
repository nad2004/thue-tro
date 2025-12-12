import ArticleService from '../services/Article.service.js';
import { successResponse } from '../utils/response.js'; // Import template phản hồi chuẩn
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

class ArticleController {
  // --- TẠO BÀI VIẾT MỚI ---
  create = asyncHandler(async (req, res) => {
    req.body.authorID = req.user.id;

    // 2. Xử lý Upload ảnh (nếu có)
    if (req.files) {
      // a. Upload Thumbnail (Ảnh đại diện)
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbBuffer = req.files.thumbnail[0].buffer;
        // Upload vào folder 'nhatro/thumbnails'
        const result = await uploadToCloudinary(thumbBuffer, 'nhatro/thumbnails');
        req.body.thumbnail = result.secure_url;
      }

      // b. Upload Images (Ảnh chi tiết)
      if (req.files.images && req.files.images.length > 0) {
        // Upload song song để tiết kiệm thời gian
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, 'nhatro/details'),
        );
        const results = await Promise.all(uploadPromises);

        // Lấy mảng URL từ kết quả Cloudinary
        req.body.images = results.map((img) => img.secure_url);
      }
    }

    // 3. Gọi Service để lưu vào DB
    const result = await ArticleService.create(req.body);

    // 4. Trả về response chuẩn
    return successResponse(res, result, 'Tạo bài viết thành công', 201);
  });

  // --- CẬP NHẬT BÀI VIẾT ---
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Xử lý Upload ảnh mới (nếu người dùng gửi lên)
    if (req.files) {
      // Update Thumbnail
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbBuffer = req.files.thumbnail[0].buffer;
        const result = await uploadToCloudinary(thumbBuffer, 'nhatro/thumbnails');
        req.body.thumbnail = result.secure_url;
      }

      // Update Images (Lưu ý: Logic này sẽ GHI ĐÈ danh sách ảnh cũ)
      if (req.files.images && req.files.images.length > 0) {
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, 'nhatro/details'),
        );
        const results = await Promise.all(uploadPromises);
        req.body.images = results.map((img) => img.secure_url);
      }
    }

    // 2. Gọi Service cập nhật (Truyền user info để check quyền chính chủ/admin)
    const result = await ArticleService.update(id, req.body, req.user.id, req.user.role);

    return successResponse(res, result, 'Cập nhật bài viết thành công');
  });

  // --- DUYỆT BÀI (ADMIN) ---
  approve = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Gọi service duyệt bài
    const result = await ArticleService.approve(id);

    return successResponse(res, result, 'Đã duyệt bài viết thành công');
  });

  // --- LẤY DANH SÁCH (FILTER / SEARCH) ---
  getAll = asyncHandler(async (req, res) => {
    const currentUserID = req.user ? req.user.id : null;

    if (req.query.tags && typeof req.query.tags === 'string') {
      req.query.tags = req.query.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const result = await ArticleService.getAll(req.query, currentUserID);

    return successResponse(res, result, 'Lấy danh sách thành công');
  });
  getMyArticles = asyncHandler(async (req, res) => {
    const userID = req.user.id;

    const result = await ArticleService.getMyArticles(userID, req.query);

    return successResponse(res, result, 'Lấy danh sách bài viết của bạn thành công');
  });
  // --- LẤY CHI TIẾT 1 BÀI ---
  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserID = req.user ? req.user.id : null;
    const result = await ArticleService.getById(id, currentUserID);

    return successResponse(res, result, 'Lấy chi tiết thành công');
  });

  // --- XÓA BÀI VIẾT ---
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Gọi service xóa (có thể thêm logic check quyền ở service nếu cần kỹ hơn)
    await ArticleService.delete(id);

    return successResponse(res, null, 'Xóa bài viết thành công');
  });
}

export default new ArticleController();
