import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';

const authRoutes = Router({ mergeParams: true });

// POST /api/auth/register
authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/logout', logoutUser);

export default authRoutes;
