var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');
var Q = require('q');


function UrlToImage() {
    var api = {};

    api.render = function(url, file, opts) {
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

        exec('phantomjs ' + args.join(' '), execOpts, function(err, stdout) {
            def.resolve(err);
        });

        return def;
    };

    return api;
}

module.exports = UrlToImage;