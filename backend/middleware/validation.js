const { body, param, query } = require('express-validator');
const logger = require('../utils/logger');

module.exports = {
  validateRegister: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
    body('personalInfo.lastName').notEmpty().withMessage('Last name is required')
  ],

  validateLogin: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],

  validateBudget: [
    body('category').notEmpty().withMessage('Category is required'),
    body('limit').isFloat({ min: 0 }).withMessage('Limit must be a positive number'),
    body('timeframe').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid timeframe')
  ],

  validateTransaction: [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type')
  ],

  validatePagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};