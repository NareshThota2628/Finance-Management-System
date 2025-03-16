const Joi = require('joi');

const validateRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  personalInfo: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  }).required()
});

const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const validateBudget = Joi.object({
  category: Joi.string().required(),
  limit: Joi.number().positive().required(),
  timeframe: Joi.string().valid('daily', 'weekly', 'monthly').required()
});

module.exports = {
  validateRegister,
  validateLogin,
  validateBudget
};