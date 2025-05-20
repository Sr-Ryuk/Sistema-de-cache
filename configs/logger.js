const chalk = require('chalk');

function logFromCache(message) {
  console.log(chalk.cyan('[CACHE]'), message);
}

function logFromDatabase(message) {
  console.log(chalk.yellow('[DB]'), message);
}

function logSuccess(message) {
  console.log(chalk.green('[SUCESSO]'), message);
}

function logError(message) {
  console.log(chalk.red('[ERRO]'), message);
}

function logInfo(message) {
  console.log(chalk.blue('[INFO]'), message);
}

module.exports = {
  logFromCache,
  logFromDatabase,
  logSuccess,
  logError,
  logInfo
};