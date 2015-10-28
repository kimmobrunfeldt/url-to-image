var _ = require('lodash');
var yargs = require('yargs');

var VERSION = require('../package.json').version;

var defaultOpts = {
    width: 1280,
    height: 800,
    requestTimeout: 300,
    maxTimeout: 1000 * 10,
    killTimeout: 1000 * 60 * 2,
    verbose: false,
    phantomArguments: '--ignore-ssl-errors=true'
};

function getOpts(argv) {
    var userOpts = getUserOpts();
    var opts = _.merge(defaultOpts, userOpts);
    return validateAndTransformOpts(opts);
}

function getUserOpts() {
    var userOpts = yargs
    .usage(
        'Usage: $0 <url> <path> [options]\n\n' +
        '<url>   Url to take screenshot of\n' +
        '<path>  File path where the screenshot is saved\n'
    )
    .example('$0 http://google.com google.png')
    .demand(2)
    .option('width', {
        describe: 'Width of the viewport',
        default: defaultOpts.width,
        type: 'string'
    })
    .option('height', {
        describe: 'Height of the viewport',
        default: defaultOpts.height,
        type: 'string'
    })
    .option('request-timeout', {
        describe: 'How long in ms do we wait for additional requests' +
                  ' after all initial requests have gotten their response',
        default: defaultOpts.requestTimeout,
        type: 'string'
    })
    .option('max-timeout', {
        describe: 'How long in ms do we wait at maximum. The screenshot is' +
                  ' taken after this time even though resources are not loaded',
        default: defaultOpts.maxTimeout,
        type: 'string'
    })
    .option('kill-timeout', {
        describe: 'How long in ms do we wait for phantomjs process to finish.' +
                  ' If the process is running after this time, it is killed.',
        default: defaultOpts.killTimeout,
        type: 'string'
    })
    .option('phantom-arguments', {
        describe: 'Command line arguments to be passed to phantomjs process.' +
                  'You must use the format --phantom-arguments="--version".',
        default: defaultOpts.phantomArguments,
        type: 'string'
    })
    .option('verbose', {
        describe: 'If set, script will output additional information to stdout.',
        default: defaultOpts.verbose,
        type: 'boolean'
    })
    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .version(VERSION)
    .argv;

    userOpts.url = userOpts._[0];
    userOpts.path = userOpts._[1];
    return userOpts;
}

function validateAndTransformOpts(opts) {
    if (opts.width) {
        validateNumber(opts.width, 'Incorrect argument, width is not a number');
    }

    if (opts.height) {
        validateNumber(opts.height, 'Incorrect argument, height is not a number');
    }

    if (opts.requestTimeout) {
        validateNumber(opts.requestTimeout, 'Incorrect argument, request timeout is not a number');
    }

    if (opts.maxTimeout) {
        validateNumber(opts.maxTimeout, 'Incorrect argument, max timeout is not a number');
    }

    if (opts.killTimeout) {
        validateNumber(opts.killTimeout, 'Incorrect argument, kill timeout is not a number');
    }

    return opts;
}

function validateNumber(val, message) {
    var number = Number(val);
    if (!_.isNumber(number)) {
        var err = message;
        err.argumentError = true;
        throw err;
    }
}

module.exports = {
    defaultOpts: defaultOpts,
    getOpts: getOpts
};
