import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createComment, getComments, deleteComment } from '../controllers/comments.controller.js';

const router = Router();

router.post('/tasks/:taskId/comments', authMiddleware, createComment);
router.get('/tasks/:taskId/comments', authMiddleware, getComments);
router.delete('/comments/:id', authMiddleware, deleteComment);

export default router;
