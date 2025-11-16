import Joi from 'joi';

// Validate :id param
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be an integer',
    'number.positive': 'ID must be a positive number',
    'any.required': 'ID is required',
  }),
}).options({ abortEarly: false });

// Validate role update
export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required().messages({
    'any.only': "Role must be either 'user' or 'admin'",
    'any.required': 'Role is required',
  }),
}).options({ abortEarly: false });
