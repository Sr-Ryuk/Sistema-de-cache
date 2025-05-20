'use strict';

const cache = require('../configs/cache');
const chalk = require('chalk');

/**
 * Middleware to cache API responses
 * @param {string} key - Cache key prefix
 * @param {number} ttl - Time to live in seconds (optional, uses default if not specified)
 */
const cacheMiddleware = (key, ttl) => {
  return (req, res, next) => {
    const cacheKey = `${key}_${req.originalUrl}`;
    
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log(chalk.green('[CACHE HIT]'), `Key: ${cacheKey}`);
      
      return res.status(200).json({
        ...cachedData,
        fromCache: true
      });
    }
    
    console.log(chalk.yellow('[CACHE MISS]'), `Key: ${cacheKey}`);
    
    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode === 200) {
        cache.set(cacheKey, data, ttl);
        console.log(chalk.blue('[CACHE SET]'), `Key: ${cacheKey}, TTL: ${ttl}s`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to clear cache by key pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const clearCache = (pattern) => {
  return (req, res, next) => {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.startsWith(pattern));
    
    if (keysToDelete.length > 0) {
      keysToDelete.forEach(key => cache.del(key));
      console.log(chalk.red('[CACHE CLEAR]'), `Cleared ${keysToDelete.length} keys matching: ${pattern}`);
    }
    
    next();
  };
};

module.exports = {
  cacheMiddleware,
  clearCache
};