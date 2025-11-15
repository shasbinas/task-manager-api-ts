import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';
import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', authMiddleware, adminOnly, getUsers);
router.get('/:id', authMiddleware, adminOnly, getUserById);

router.put('/:id/role', authMiddleware, adminOnly, updateUserRole);

router.delete('/:id', authMiddleware, adminOnly, deleteUser);

export default router;
