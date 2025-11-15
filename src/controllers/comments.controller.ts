import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const createComment = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw ApiError.badRequest('Comment content is required');
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId: Number(taskId),
      userId: req.user!.id, // 👈 FIX: req.user! (non-null)
    },
  });

  return res.json({ success: true, data: comment });
};

export const getComments = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const comments = await prisma.comment.findMany({
    where: { taskId: Number(taskId) },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: comments });
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({
    where: { id: Number(id) },
  });

  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  // Only comment owner OR admin can delete
  if (comment.userId !== req.user!.id && req.user!.role !== 'admin') {
    // 👆 FIXED using req.user!
    throw ApiError.forbidden('Not allowed');
  }

  await prisma.comment.delete({
    where: { id: Number(id) },
  });

  return res.json({ success: true, message: 'Comment deleted' });
};
