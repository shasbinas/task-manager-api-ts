import Joi from 'joi';

export const createTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 100 characters',
  }),

  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),

  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending').messages({
    'any.only': "Status must be 'pending', 'in-progress', or 'completed'",
  }),

  assigneeId: Joi.number().integer().optional().messages({
    'number.base': 'Assignee ID must be a number',
    'number.integer': 'Assignee ID must be an integer',
  }),
}).options({ abortEarly: false, stripUnknown: true });

export const updateTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  assigneeId: Joi.number().integer().optional(),
}).options({ abortEarly: false, stripUnknown: true });
