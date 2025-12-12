// src/middleware/error.middleware.js
import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log lỗi ra console server

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi Server Nội Bộ';

  // Xử lý các lỗi Mongoose thường gặp (Tuỳ chọn)
  if (err.name === 'CastError') {
    message = `Không tìm thấy tài nguyên với ID: ${err.value}`;
    statusCode = 404;
  }
  if (err.code === 11000) {
    message = 'Dữ liệu bị trùng lặp (Duplicate field value entered)';
    statusCode = 400;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Trả về theo template
  return errorResponse(res, message, statusCode);
};
