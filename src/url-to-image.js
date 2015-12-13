// PhantomJS script
// Takes screenshot of a given page. This correctly handles pages which
// dynamically load content making AJAX requests.

// Instead of waiting fixed amount of time before rendering, we give a short
// time for the page to make additional requests. (abstracted)

// Phantom internals
var system = require('system');
var webPage = require('webpage');

function main() {
    // I tried to use yargs as a nicer commandline option parser but
    // it doesn't run in phantomjs environment
    var args = system.args;
    var opts = {
        url: args[1],
        filePath: args[2],
        width: args[3],
        height: args[4],
        requestTimeout: args[5],
        maxTimeout: args[6],
        verbose: args[7] === 'true',
        fileType: args[8],
        fileQuality: args[9] ? args[9] : 100,
        cropWidth: args[10],
        cropHeight: args[11],
        cropOffsetLeft: args[12] ? args[12] : 0,
        cropOffsetTop: args[13] ? args[13] : 0

    };

    renderPage(opts);

}

function renderPage(opts) {
    var requestCount = 0;
    var forceRenderTimeout;
    var dynamicRenderTimeout;
    var firstResponseFlag = false;
    var successCallbacks = 0;

    var page = webPage.create();
    page.viewportSize = {
        width: opts.width,
        height: opts.height
    };
    // Silence confirmation messages and errors
    page.onConfirm = page.onPrompt = function noOp() {
    };
    page.onError = function (err) {
        log('Page error:', err);
    };


    page.onResourceRequested = function (request) {
        log('->', request.method, request.url);
        requestCount += 1;
        clearTimeout(dynamicRenderTimeout);
    };

    page.onResourceReceived = function (response) {
        log('<-', response.status, response.url);
        if (!response.stage || response.stage === 'end') {
            // start force rendering timer now that we have a 200 response
            if (firstResponseFlag === true && response.status == 200) {
                firstResponseFlag = false;
                forceRenderTimeout = setTimeout(beginRenderAndExit, opts.maxTimeout);
            }

            requestCount -= 1;
            if (requestCount === 0 && successCallbacks === 0) {
                dynamicRenderTimeout = setTimeout(beginRenderAndExit, opts.requestTimeout);

            }
        }
    };

    //start the the timer to force rendering once the first request is made.
    page.onLoadStarted = function () {
        firstResponseFlag = true;
    };

    // direct callback that PhantomJS page.open uses.
    page.onLoadFinished = function (status) {
        if (status !== 'success') {
            log('Unable to load url:', opts.url);
            phantom.exit(10);
        } else {
            beginRenderAndExit();
        }
    };

    page.open(opts.url);


    function log() {
        // PhangomJS doesn't stringify objects very well, doing that manually
        if (opts.verbose) {
            var args = Array.prototype.slice.call(arguments);

            var str = '';
            args.forEach(function (arg) {
                if (isString) {
                    str += arg;
                } else {
                    str += JSON.stringify(arg, null, 2);
                }

                str += ' '
            });

            console.log(str);
        }
    }

    function beginRenderAndExit() {
        successCallbacks += 1;
        if (successCallbacks == 1) {
            clearTimeout(dynamicRenderTimeout);
            waitForFrameToRender();
        }
    }

    // Wait for frame to solve the about:blank frame access complaint
    function waitForFrameToRender(interval) {
        if (typeof interval === 'undefined') {
            interval = 1000;
        }

        setTimeout(function () {
            renderAndExit();
        }, interval);


    }

    function renderAndExit() {
        log('Render screenshot..');
        var pageToRender = page;
        page.close(); //close the page so no more requests come in.
        if (opts.cropWidth && opts.cropHeight) {
            log("Cropping...");
            pageToRender.clipRect = {
                top: opts.cropOffsetTop,
                left: opts.cropOffsetLeft,
                width: opts.cropWidth,
                height: opts.cropHeight
            };
        }

        var renderOpts = {
            fileQuality: opts.fileQuality
        };

        if (opts.fileType) {
            log("Adjusting File Type...");
            renderOpts.fileType = opts.fileType;
        }

        pageToRender.render(opts.filePath, renderOpts);
        pageToRender.close();
        log('done.');
        exit();
    }
}
//custom exit function
function exit(code) {
    setTimeout(function () {
        phantom.exit(code);
    }, 0);
    phantom.onError = function () {
    };
}

function isString(value) {
    return typeof value == 'string'
}

main();