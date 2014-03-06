var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');
var Q = require('q');


var UrlToImage = (function() {
    var api = {};

    api.render = function(url, file, opts) {
        opts = _.extend({
            width: 1280,
            height: 800
        }, opts);

        var def = Q.defer();

        var args = [
            path.join(__dirname, 'url-to-image.js'),
            url,
            file,
            opts.width,
            opts.height
        ];

        var execOpts = {
            maxBuffer: Infinity
        };

        exec('phantomjs ' + args.join(' '), execOpts, function(err, stdout, stderr) {
            if (err === null) {
                def.resolve();
            } else {
                def.reject(new Error(stderr));
            }

        });

        return def.promise;
    };

    return api;
})();

module.exports = UrlToImage.render;