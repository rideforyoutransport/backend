const winston = require('winston');

require('winston-daily-rotate-file');
let logger;

if (process.env.NODE_ENV !== 'PROD') {
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new (winston.transports.DailyRotateFile)({
        filename: 'stdout.log',
        datePattern: '.yyyy-MM-DD',
        zippedArchive: true,
        maxSize: '2m',
        maxFiles: '7d'
      })
    ]
  });
} else {
  /**
   * Use this logger while testing
   * This won't pollute the console
   * */
  logger = winston.createLogger({
    transports: [
      new (winston.transports.DailyRotateFile)({
        filename: 'stdout.log',
        datePattern: '.yyyy-MM-DD',
        zippedArchive: true,
        maxSize: '2m',
        maxFiles: '7d'
      })
    ]
  });
}

module.exports = logger;
