const NodeCache = require('node-cache');
const logger = require('./logger');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const getCache = (key) => {
  const value = cache.get(key);
  if (value) logger.info(`Cache hit for key: ${key}`);
  return value;
};

const setCache = (key, value, ttl = 300) => {
  cache.set(key, value, ttl);
  logger.info(`Cache set for key: ${key}`);
};

const deleteCache = (key) => {
  cache.del(key);
  logger.info(`Cache deleted for key: ${key}`);
};

module.exports = { getCache, setCache, deleteCache };