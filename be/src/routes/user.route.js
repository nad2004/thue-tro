import express from 'express';
import UserController from '../controllers/User.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Sẽ tạo ở bước 4
import { upload } from '../middleware/multer.middleware.js'; // Sẽ tạo ở bước 4

const router = express.Router();

// Public Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAll);

// Protected Routes (Yêu cầu token)
router.put('/profile', protect, UserController.updateProfile);
router.post('/avatar', protect, upload.single('avatar'), UserController.uploadAvatar);


export default router;