import CategoryService from '../services/Category.service.js';
import { successResponse } from '../utils/response.js'; 
import { asyncHandler } from '../utils/asyncHandler.js';

class CategoryController {
  
  create = asyncHandler(async (req, res) => {
    const result = await CategoryService.create(req.body);
    successResponse(res, result, 'Tạo chuyên mục thành công', 201);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await CategoryService.getAll();
    successResponse(res, result);
  });

  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryService.getById(id);
    if (!result) throw { message: "Chuyên mục không tồn tại", statusCode: 404 };
    successResponse(res, result);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryService.update(id, req.body);
    if (!result) throw { message: "Không tìm thấy chuyên mục", statusCode: 404 };
    successResponse(res, result, 'Cập nhật thành công');
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryService.delete(id);
    if (!result) throw { message: "Không tìm thấy chuyên mục để xóa", statusCode: 404 };
    successResponse(res, result, 'Xóa thành công');
  });
}

export default new CategoryController();