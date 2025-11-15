import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
} from '../controllers/tasks.controller.js';

const taskRouter = Router();

taskRouter.post('/', authMiddleware, createTask);
taskRouter.get('/', authMiddleware, getTasks);
taskRouter.get('/:id', authMiddleware, getTaskById);
taskRouter.put('/:id', authMiddleware, updateTask);
taskRouter.delete('/:id', authMiddleware, deleteTask);

// ✅ ADD THIS ROUTE
taskRouter.put('/:id/complete', authMiddleware, completeTask);

export default taskRouter;
