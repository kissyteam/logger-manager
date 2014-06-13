/**
 * simple logger management.
 * @author yiminghe@gmail.com
 */

var config = {};

function getLogger(logger) {
    var obj = {};
    for (var cat in loggerLevel) {
        /*jshint loopfunc: true*/
        (function (obj, cat) {
            obj[cat] = function (msg) {
                return Logger.log(msg, cat, logger);
            };
        })(obj, cat);
    }
    return obj;
}

var loggerLevel = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
};

var Logger = module.exports = {
    config: function (cfg) {
        if (cfg) {
            config = cfg;
        }
        return config;
    },
    /**
     * Prints debug info.
     * @param msg {String} the message to log.
     * @param {String} [cat] the log category for the message. Default
     *        categories are 'info', 'warn', 'error', 'time' etc.
     * @param {String} [logger] the logger of the the message (opt)
     */
    log: function (msg, cat, logger) {
        var matched = 1;
        if (logger) {
            var list, i, l, level, minLevel, maxLevel, reg;
            cat = cat || 'debug';
            level = loggerLevel[cat] || loggerLevel.debug;
            if ((list = config.includes)) {
                matched = 0;
                for (i = 0; i < list.length; i++) {
                    l = list[i];
                    reg = l.logger;
                    maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                    minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                    if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                        matched = 1;
                        break;
                    }
                }
            } else if ((list = config.excludes)) {
                matched = 1;
                for (i = 0; i < list.length; i++) {
                    l = list[i];
                    reg = l.logger;
                    maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                    minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                    if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                        matched = 0;
                        break;
                    }
                }
            }
            if (matched) {
                msg = logger + ': ' + msg;
            }
        }
        /*global console*/
        if (matched) {
            if (typeof console !== 'undefined' && console.log) {
                console[cat && console[cat] ? cat : 'log'](msg);
            }
            return msg;
        }
        return undefined;
    },

    /**
     * get log instance for specified logger
     * @param {String} logger logger name
     * @returns log instance
     */
    getLogger: function (logger) {
        return getLogger(logger);
    },

    /**
     * Throws error message.
     */
    error: function (msg) {
        // with stack info!
        throw msg instanceof  Error ? msg : new Error(msg);
    }
};