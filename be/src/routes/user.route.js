// src/routes/user.route.js
import express from 'express';
import UserController from '../controllers/User.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(protect);
router.get('/', authorize('Admin'), UserController.getAll);
router.get('/my-profile', UserController.getMyProfile);
router.put('/profile', UserController.updateProfile);
router.post('/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.post('/save-article', UserController.toggleSaveArticle);
router.get('/saved-articles', UserController.getSavedArticles);

export default router;
