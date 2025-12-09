// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserService from '../services/User.service.js';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ DB (không bao gồm password)
      const user = await UserService.getById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Token không hợp lệ, người dùng không tồn tại.' });
      }

      // Gán user vào req object để sử dụng ở Controller
      req.user = user; 
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Không được ủy quyền, token thất bại.' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Không được ủy quyền, thiếu token.' });
  }
};