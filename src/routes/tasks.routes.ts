import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  assignTask, // ⭐ MUST BE IMPORTED
} from '../controllers/tasks.controller.js';

const taskRouter = Router();

taskRouter.post('/', authMiddleware, createTask);
taskRouter.get('/', authMiddleware, getTasks);
taskRouter.get('/:id', authMiddleware, getTaskById);
taskRouter.put('/:id', authMiddleware, updateTask);
taskRouter.delete('/:id', authMiddleware, deleteTask);

// ⭐ COMPLETE TASK
taskRouter.put('/:id/complete', authMiddleware, completeTask);

// ⭐ ASSIGN TASK (the route you were missing!)
taskRouter.put('/:id/assign', authMiddleware, assignTask);

export default taskRouter;
