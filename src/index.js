#!/usr/bin/env node
'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs')
const cliParser = require('./cli-parser');

function render(url, filePath, opts) {
    opts = _.extend(cliParser.defaultOpts, opts);

    let args = [];
    if (_.isString(opts.phantomArguments)) {
        args = opts.phantomArguments.split(' ');
    }

    if (!_.startsWith(url, 'http') &&
        !_.startsWith(url, 'https') &&
        !_.startsWith(url, 'file')) {
        url = 'http://' + url;
    }

    args = args.concat([
        path.join(__dirname, 'url-to-image.js'),
        url,
        filePath,
        opts.width,
        opts.height,
        opts.requestTimeout,
        opts.maxTimeout,
        opts.verbose,
        opts.fileType,
        opts.fileQuality,
        opts.cropWidth,
        opts.cropHeight,
        opts.cropOffsetLeft,
        opts.cropOffsetTop
    ]);

    let execOpts = {
        maxBuffer: Infinity
    };

    let killTimer;
    return new Promise(function(resolve, reject) {
        let child;
        killTimer = setTimeout(function() {
            killPhantom(opts, child);
            reject(new Error('Phantomjs process timeout'));
        }, opts.killTimeout);

        try {
            child = childProcess.spawn(phantomjs.path, args, {
                stdio: 'inherit'
            });
        } catch (err) {
            return Promise.reject(err);
        }

        function errorHandler(err) {
            // Remove bound handlers after use
            child.removeListener('close', closeHandler);
            reject(err);
        }

        function closeHandler(exitCode) {
            child.removeListener('error', errorHandler);
            if (exitCode > 0) {
                let err;
                if (exitCode === 10) {
                    err = new Error('Unable to load given url: ' + url);
                }
                reject(err);
            } else {
                resolve(exitCode);
            }
        }

        child.once('error', errorHandler);
        child.once('close', closeHandler);
    })
    .finally(function() {
        if (killTimer) {
            clearTimeout(killTimer);
        }
    });
}

function killPhantom(opts, child) {
    if (child) {
        const msg = 'Phantomjs process didn\'t finish in ' +
                  opts.killTimeout + 'ms, killing it..';
        console.error(msg);

        child.kill();
    }
}

if (require.main === module) {
    let opts;
    try {
        opts = cliParser.getOpts();
    } catch (err) {
        if (err.argumentError) {
            console.error(err.message);
            process.exit(1);
        }

        throw err;
    }

    render(opts.url, opts.path, opts)
    .catch(function(err) {
        console.error('\nTaking screenshot failed to error:');
        if (err && err.message) {
            console.error(err.message);
        } else if (err) {
            console.error(err);
        } else {
            console.error('No error message available');
        }

        process.exit(2);
    });
}

module.exports = render;
