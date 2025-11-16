import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';
import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/users.controller.js';

import { validate } from '../middlewares/validate.js';
import { idParamSchema, updateRoleSchema } from '../validations/user.validation.js';

const router = Router();

// --------------------
// GET USERS
// --------------------
router.get('/', authMiddleware, adminOnly, getUsers);

// --------------------
// GET USER BY ID
// --------------------
router.get('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), getUserById);

// --------------------
// UPDATE ROLE
// --------------------
router.put(
  '/:id/role',
  authMiddleware,
  adminOnly,
  validate(idParamSchema, 'params'),
  validate(updateRoleSchema, 'body'),
  updateUserRole,
);

// --------------------
// DELETE USER
// --------------------
router.delete('/:id', authMiddleware, adminOnly, validate(idParamSchema, 'params'), deleteUser);

export default router;
