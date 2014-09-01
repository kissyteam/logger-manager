var LoggerManager = require('../../');
LoggerManager.config({
    excludes: [
        {
            logger: /^modulex\/.*/,
            maxLevel: 'info',
            minLevel: 'debug'
        }
    ]
});
logger = LoggerManager.getLogger('modulex/z');
console.log('*********************');
logger.debug('x')
console.log('*********************');