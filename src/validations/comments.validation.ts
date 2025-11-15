import Joi from 'joi';

export const createCommentSchema = Joi.object({
  content: Joi.string().min(2).max(500).required().messages({
    'string.base': 'Comment must be text',
    'string.empty': 'Comment content is required',
    'string.min': 'Comment must be at least 2 characters',
    'string.max': 'Comment must be less than 500 characters',
    'any.required': 'Comment content is required',
  }),
});
