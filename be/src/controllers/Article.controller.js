// src/controllers/Article.controller.js
import ArticleService from '../services/Article.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js'; // Import named export

class ArticleController {
  
  create = asyncHandler(async (req, res) => {
    // Gán ID người dùng đăng bài
    req.body.authorID = req.user.id; 
    
    // --- XỬ LÝ UPLOAD ẢNH ---
    if (req.files) {
      // 1. Upload Thumbnail (Ảnh đại diện)
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbBuffer = req.files.thumbnail[0].buffer;
        const result = await uploadToCloudinary(thumbBuffer, 'nhatro/thumbnails');
        req.body.thumbnail = result.secure_url;
      }

      // 2. Upload Images (Ảnh chi tiết)
      if (req.files.images && req.files.images.length > 0) {
        // Dùng Promise.all để upload song song nhiều ảnh cho nhanh
        const uploadPromises = req.files.images.map(file => 
          uploadToCloudinary(file.buffer, 'nhatro/details')
        );
        const results = await Promise.all(uploadPromises);
        
        // Lấy danh sách URL trả về
        req.body.images = results.map(img => img.secure_url);
      }
    }
    // ------------------------

    const result = await ArticleService.create(req.body);
    successResponse(res, result, "Tạo bài viết thành công", 201);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // --- XỬ LÝ UPLOAD ẢNH KHI UPDATE ---
    if (req.files) {
      // Nếu có gửi thumbnail mới -> Upload và update link mới
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbBuffer = req.files.thumbnail[0].buffer;
        const result = await uploadToCloudinary(thumbBuffer, 'nhatro/thumbnails');
        req.body.thumbnail = result.secure_url;
      }

      // Nếu có gửi ảnh chi tiết mới
      if (req.files.images && req.files.images.length > 0) {
        const uploadPromises = req.files.images.map(file => 
          uploadToCloudinary(file.buffer, 'nhatro/details')
        );
        const results = await Promise.all(uploadPromises);
        
        // Lưu ý: Logic này sẽ thay thế danh sách ảnh cũ bằng ảnh mới.
        // Nếu muốn nối thêm (append), cần xử lý logic đó trong Service.
        req.body.images = results.map(img => img.secure_url);
      }
    }
    // -----------------------------------

    // Truyền user info để check quyền sở hữu bài viết
    const result = await ArticleService.update(id, req.body, req.user.id, req.user.role);
    successResponse(res, result, "Cập nhật thành công");
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await ArticleService.getAll(req.query);
    successResponse(res, result);
  });

  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleService.getById(id);
    if (!result) throw { message: "Không tìm thấy bài viết", statusCode: 404 };
    successResponse(res, result);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ArticleService.delete(id);
    successResponse(res, null, "Xóa bài viết thành công");
  });
}

export default new ArticleController();