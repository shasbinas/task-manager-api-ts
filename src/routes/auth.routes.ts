import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  registerValidation,
  loginValidation,
  logoutValidation,
} from '../validations/auth.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { uploadProfile } from '../middlewares/uploadProfile.js';
import { uploadProfilePicture } from '../controllers/users.controller.js';

const authRoutes = Router({ mergeParams: true });

authRoutes.post('/register', validate(registerValidation), registerUser);
authRoutes.post('/login', validate(loginValidation), loginUser);
authRoutes.post('/logout', validate(logoutValidation), logoutUser);
authRoutes.put(
  '/profile/picture',
  authMiddleware,
  uploadProfile.single('image'),
  uploadProfilePicture,
);

export default authRoutes;
