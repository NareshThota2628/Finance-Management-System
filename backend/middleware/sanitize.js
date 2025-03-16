const { body, query, param } = require('express-validator');
const logger = require('../utils/logger');

module.exports = {
  sanitizeUserInput: [
    body('email').trim().escape(),
    body('password').trim(),
    body('personalInfo.firstName').trim().escape(),
    body('personalInfo.lastName').trim().escape()
  ],

  sanitizeTransactionInput: [
    body('amount').toFloat(),
    body('category').trim().escape(),
    body('description').trim().escape()
  ],

  sanitizeQueryParams: [
    query('page').toInt(),
    query('limit').toInt(),
    query('search').trim().escape()
  ],

  sanitizeParams: [
    param('id').trim().escape()
  ]
};