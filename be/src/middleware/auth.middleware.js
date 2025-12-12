// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserService from '../services/User.service.js';
import { errorResponse } from '../utils/response.js'; // <--- Import template

dotenv.config();

export const protectOptional = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserService.getById(decoded.id);
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  } else {
    req.user = null;
    return next();
  }
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserService.getById(decoded.id);

      if (!user) {
        return errorResponse(res, 'Token không hợp lệ, người dùng không tồn tại.', 401);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return errorResponse(res, 'Không được ủy quyền, token không hợp lệ.', 401);
    }
  } else {
    return errorResponse(res, 'Không được ủy quyền, thiếu token.', 401);
  }
};

// --- AUTHORIZATION ---
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Người dùng chưa đăng nhập', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Bạn không có quyền (${req.user.role}) truy cập tài nguyên này.`,
        403,
      );
    }

    next();
  };
};
