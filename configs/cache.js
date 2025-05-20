'use strict';

const NodeCache = require('node-cache');
const dotenv = require('dotenv');
const chalk = require('chalk');
dotenv.config();

const cacheTTL = parseInt(process.env.CACHE_TTL, 10) || 30; 


const cache = new NodeCache({
  stdTTL: cacheTTL,
  checkperiod: cacheTTL * 0.2, 
  useClones: false 
});


setInterval(() => {
  const stats = cache.getStats();
  console.log(chalk.blue('Cache stats:'), {
    keys: cache.keys().length,
    hits: chalk.green(stats.hits),
    misses: chalk.yellow(stats.misses),
    ksize: stats.ksize,
    vsize: stats.vsize
  });
}, 300000); 

module.exports = cache;