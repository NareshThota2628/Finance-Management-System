const NodeCache = require('node-cache');
const logger = require('../utils/logger');

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

module.exports = (duration) => (req, res, next) => {
  const key = req.originalUrl || req.url;

  if (req.method !== 'GET') {
    logger.warn(`Cache skipped for non-GET request: ${req.method} ${key}`);
    return next();
  }

  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    logger.info(`Cache hit for: ${key}`);
    return res.json(cachedResponse);
  }

  logger.info(`Cache miss for: ${key}`);
  res.originalSend = res.json;
  res.json = (body) => {
    cache.set(key, body, duration);
    res.originalSend(body);
  };

  next();
};