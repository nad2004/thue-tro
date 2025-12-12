import UserService from '../services/User.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { successResponse } from '../utils/response.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

class UserController {
  register = asyncHandler(async (req, res) => {
    const { password, ...userData } = req.body;
    if (!password) throw { message: 'Mật khẩu là bắt buộc.', statusCode: 400 };

    const result = await UserService.register({ ...userData, password });
    const token = generateToken(result);

    successResponse(res, { data: result, token }, 'Đăng ký thành công', 201);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw { message: 'Thiếu email hoặc mật khẩu.', statusCode: 400 };

    const user = await UserService.login(email, password);
    const token = generateToken(user);

    successResponse(res, { data: user, token }, 'Đăng nhập thành công');
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await UserService.getAll();
    successResponse(res, result);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { role, password, ...updateData } = req.body;

    const updatedUser = await UserService.update(userId, updateData);
    successResponse(res, updatedUser, 'Cập nhật hồ sơ thành công');
  });

  uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) throw { message: 'Vui lòng tải lên file ảnh.', statusCode: 400 };

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'blog-avatars');
    const updatedUser = await UserService.update(req.user.id, {
      avatar: uploadResult.secure_url,
    });

    successResponse(res, updatedUser, 'Cập nhật Avatar thành công');
  });
  getMyProfile = asyncHandler(async (req, res) => {
    // req.user.id lấy từ middleware protect
    const user = await UserService.getById(req.user.id);
    successResponse(res, user, 'Lấy thông tin cá nhân thành công');
  });
  toggleSaveArticle = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    if (!articleId) throw { message: 'Thiếu Article ID', statusCode: 400 };

    const result = await UserService.toggleSaveArticle(req.user.id, articleId);

    const message = result.saved ? 'Đã lưu tin thành công' : 'Đã bỏ lưu tin';
    successResponse(res, result, message);
  });
  getSavedArticles = asyncHandler(async (req, res) => {
    const savedList = await UserService.getSavedArticles(req.user.id);
    successResponse(res, savedList, 'Lấy danh sách tin đã lưu thành công');
  });
}

export default new UserController();
