import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { taskService } from '../services/task.service.js';

// CREATE TASK
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(Number(req.user!.id), req.body);
  res.status(201).json({ success: true, data: task });
});

// GET LIST
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getTasks(req.query);
  res.json({ success: true, data: tasks });
});

// GET BY ID
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(Number(req.params.id));
  res.json({ success: true, data: task });
});

// UPDATE
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(Number(req.params.id), req.body);
  res.json({ success: true, data: task });
});

// DELETE
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(Number(req.params.id));
  res.json({ success: true, message: 'Task deleted' });
});

// ASSIGN
export const assignTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.assignTask(Number(req.params.id), Number(req.body.assigneeId));
  res.json({ success: true, data: task });
});

// MARK COMPLETE
export const completeTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.markComplete(Number(req.params.id));
  res.json({ success: true, data: task });
});

// TODAY TASKS
export const getTodayTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getTodayTasks(Number(req.user!.id));
  res.json({ success: true, data: tasks });
});
