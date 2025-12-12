import express from 'express';
import MessageController from '../controllers/Message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', MessageController.create);
router.get('/:conversationId', MessageController.getByConversation);
router.delete('/:id', MessageController.delete);

export default router;
