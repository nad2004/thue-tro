import express from 'express';
import TagController from '../controllers/Tag.controller.js';

const router = express.Router();

router.post('/', TagController.create); // Thường yêu cầu Admin/Editor
router.get('/', TagController.getAll);
router.get('/:id', TagController.getOne);

export default router;