import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const taskService = {
  // CREATE
  async createTask(ownerId: number, data: any) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId,
        status: 'pending',
      },
    });
  },

  // GET LIST
  async getTasks(query: any) {
    const { status, search, page = 1, limit = 10, dueBefore } = query;

    return prisma.task.findMany({
      where: {
        status: status || undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        createdAt: dueBefore ? { lte: new Date(dueBefore as string) } : undefined,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
  },

  // GET ONE
  async getTaskById(id: number) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  },

  // UPDATE
  async updateTask(id: number, data: any) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  // DELETE
  async deleteTask(id: number) {
    await prisma.task.delete({ where: { id } });
  },

  // ASSIGN TASK (ADMIN ONLY)
  async assignTask(id: number, assigneeId: number) {
    return prisma.task.update({
      where: { id },
      data: { assigneeId },
    });
  },

  // COMPLETE
  async markComplete(id: number) {
    return prisma.task.update({
      where: { id },
      data: { status: 'completed' },
    });
  },

  // TODAY TASKS
  async getTodayTasks(userId: number) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return prisma.task.findMany({
      where: {
        ownerId: userId,
        createdAt: { gte: todayStart },
      },
    });
  },
};
