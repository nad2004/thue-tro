import CommentService from '../services/Comment.service.js';
import { successResponse } from '../utils/response.js'; 
import { asyncHandler } from '../utils/asyncHandler.js';

class CommentController {
  
  create = asyncHandler(async (req, res) => {
    req.body.userID = req.user ? req.user.id : null; 
    const result = await CommentService.create(req.body);
    successResponse(res, result, 'Bình luận thành công', 201);
  });

  getByArticle = asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const result = await CommentService.getByArticle(articleId);
    successResponse(res, result);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;
    const userRole = req.user.role; 

    const result = await CommentService.delete(id, userID, userRole);
    successResponse(res, result, "Xoá bình luận thành công");
  });
}

export default new CommentController();