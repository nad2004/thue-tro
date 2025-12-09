// src/middleware/multer.middleware.js
import multer from 'multer';

// Cấu hình lưu trữ (memory storage) để lấy Buffer
const storage = multer.memoryStorage();

// Cấu hình Multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
  }
});