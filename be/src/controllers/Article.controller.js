import ArticleService from '../services/Article.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class ArticleController {
  
  create = asyncHandler(async (req, res) => {
    req.body.authorID = req.user.id; 
    const result = await ArticleService.create(req.body);
    successResponse(res, result, "Tạo bài viết thành công", 201);
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

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleService.update(id, req.body);
    if (!result) throw { message: "Không tìm thấy bài viết để cập nhật", statusCode: 404 };
    successResponse(res, result, "Cập nhật thành công");
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ArticleService.delete(id);
    successResponse(res, null, "Xóa bài viết thành công");
  });
}

export default new ArticleController();