// middlewares/error.middleware.js
import { errorResponse } from '../utils/response.js';

export const errorMiddleware = (err, req, res, next) => {
  // Xác định status code: Nếu err có status thì dùng, không thì mặc định 500
  let statusCode = err.statusCode || 500;
  
  // Xử lý các lỗi đặc thù của Mongoose/MongoDB
  if (err.name === 'ValidationError') statusCode = 400;
  if (err.code === 11000) statusCode = 400; // Duplicate key
  if (err.name === 'CastError') statusCode = 400; // Invalid ID

  // Trả về response lỗi
  errorResponse(res, err.message || "Lỗi máy chủ nội bộ", statusCode);
};