import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller.js';

const authRoutes = Router({ mergeParams: true });

// POST /api/auth/register
authRoutes.post('/register', registerUser);

export default authRoutes;
