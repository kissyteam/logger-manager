var LoggerManager = require('../../');
var expect = require('chai').expect;
describe('logger-manager', function () {
    afterEach(function () {
        LoggerManager.config({});
    });
    it('works', function () {
        LoggerManager.config({
            excludes: [
                {
                    logger: /^modulex\/.*/,
                    maxLevel: 'info',
                    minLevel: 'debug'
                }
            ]
        });
        var logger = LoggerManager.getLogger('my');
        expect(logger.debug('x')).to.be.equal('my: x');
        logger = LoggerManager.getLogger('modulex/z');
        expect(!!logger.debug('x')).to.be.equal(false);
    });
    it('includes works', function () {
        LoggerManager.config({
            includes: [
                {logger: /^xx\//}
            ]
        });
        var logger = LoggerManager.getLogger('xx/y');
        expect(logger.debug('x')).to.be.equal('xx/y: x');
        logger = LoggerManager.getLogger('zz/x');
        expect(!!logger.debug('x')).to.be.equal(false);
    });
    it('excludes works', function () {
        LoggerManager.config({
            excludes: [
                {logger: /^yy\//}
            ]
        });
        var logger = LoggerManager.getLogger('xx/y');
        expect(logger.debug('x')).to.be.equal('xx/y: x');
        logger = LoggerManager.getLogger('yy/x');
        expect(!!logger.debug('x')).to.be.equal(false);
    });
    it('includes precede excludes works', function () {
        LoggerManager.config({
            includes: [
                {logger: /^xx\//}
            ],
            excludes: [
                {logger: /^xx\//}
            ]
        });
        var logger = LoggerManager.getLogger('xx/y');
        expect(logger.debug('x')).to.be.equal('xx/y: x');
        logger = LoggerManager.getLogger('yy/x');
        expect(!!logger.debug('x')).to.be.equal(false);
    });
    it('level works', function () {
        LoggerManager.config({
            excludes: [
                {
                    logger: /^xx\//,
                    maxLevel: 'info'
                }
            ]
        });
        var logger = LoggerManager.getLogger('xx/y');
        expect(!!logger.debug('x')).to.be.equal(false);
        expect(!!logger.info('x')).to.be.equal(false);
        expect(logger.warn('x')).to.be.equal('xx/y: x');
        expect(logger.error('x')).to.be.equal('xx/y: x');
    });
});