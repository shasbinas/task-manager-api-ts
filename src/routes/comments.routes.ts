import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.js';

import { createComment, getComments, deleteComment } from '../controllers/comments.controller.js';
import { createCommentSchema } from '../validations/comments.validation.js';

const router = Router();

router.post(
  '/tasks/:taskId/comments',
  authMiddleware,
  validate(createCommentSchema),
  createComment,
);

router.get('/tasks/:taskId/comments', authMiddleware, getComments);

router.delete('/comments/:id', authMiddleware, deleteComment);

export default router;
