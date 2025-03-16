const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`Error: ${message}`, {
    statusCode,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params
    }
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};