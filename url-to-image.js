// PhantomJS script
// Takes screeshot of a given page. This correctly handles pages which
// dynamically load content making AJAX requests.

// Instead of waiting fixed amount of time before rendering, we give a short
// time for the page to make additional requests.

var _ = require('lodash');


var defaultOpts = {
    // How long do we wait for additional requests
    //after all initial requests have got their response
    ajaxTimeout: 300,

    // How long do we wait at max
    maxTimeout: 10000
};

var Page = (function(opts) {
    opts = _.extend(defaultOpts, opts);
    var requestCount = 0;
    var forceRenderTimeout;
    var ajaxRenderTimeout;

    var page = require('webpage').create();
    page.viewportSize = {
        width: opts.width,
        height: opts.height
    };
    // Silence confirmation messages and errors
    page.onConfirm = page.onPrompt = page.onError = noop;

    page.onResourceRequested = function(request) {
        requestCount += 1;
        // console.log('> request  - queue size:', requestCount);
        clearTimeout(ajaxRenderTimeout);
    };

    page.onResourceReceived = function(response) {
        if (!response.stage || response.stage === 'end') {
            requestCount -= 1;
            // console.log('< response - queue size:', requestCount);
            if (requestCount === 0) {
                ajaxRenderTimeout = setTimeout(renderAndExit, opts.ajaxTimeout);
            }
        }
    };

    var api = {};

    api.render = function(url, file) {
        opts.file = file;

        page.open(url, function(status) {
            if (status !== "success") {
                console.error('Unable to load url:', url);
                phantom.exit();
            } else {
                forceRenderTimeout = setTimeout(renderAndExit, opts.maxTimeout);
            }
        });
    };

    function renderAndExit() {
        page.render(opts.file);
        phantom.exit();
    }

    function noop() {}

    return api;
});

function die(error) {
    console.error(error);
    phantom.exit(1);
}

function main() {
    var args = require('system').args;

    var url = args[1];
    var file = args[2];
    var width = args[3] || 1280;
    var height = args[4] || 800;

    var isHelp = args[1] === '-h' || args[1] === '--help';
    if (args.length === 1 || isHelp) {
        var help = 'Usage: phantomjs url-to-image.js <url> <output-file> [width] [height]\n';
        help += 'Example: phantomjs url-to-image.js http://google.com google.png 1200 800';
        die(help);
    }

    if (!url) die('Url parameter must be specified');
    if (!file) die('File parameter must be specified');

    var opts = {
        width: width,
        height: height
    };

    var page = Page(opts);
    page.render(url, file);
}


main();
