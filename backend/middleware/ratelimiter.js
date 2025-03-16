const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

module.exports = (maxRequests, windowMinutes) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: `Too many requests, please try again after ${windowMinutes} minutes.`
    });
  },
  skip: (req) => {
    // Skip rate limiting for certain routes or users
    return req.user?.role === 'admin';
  }
});