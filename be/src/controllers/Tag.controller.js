import TagService from '../services/Tag.service.js';
import { successResponse } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class TagController {
  create = asyncHandler(async (req, res) => {
    const result = await TagService.create(req.body);
    successResponse(res, result, 'Tạo thẻ thành công', 201);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await TagService.getAll();
    successResponse(res, result, 'Lấy danh sách thẻ thành công');
  });

  getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await TagService.getById(id);
    if (!result) throw { message: 'Không tìm thấy thẻ', statusCode: 404 };
    successResponse(res, result);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await TagService.update(id, req.body);
    if (!result) throw { message: 'Không tìm thấy thẻ để cập nhật', statusCode: 404 };
    successResponse(res, result, 'Cập nhật thẻ thành công');
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Service sẽ xử lý việc xóa Tag và $pull khỏi Article
    const result = await TagService.delete(id);
    successResponse(res, result, 'Xóa thẻ thành công');
  });
}

export default new TagController();
