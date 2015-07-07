var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');
var Q = require('q');


var UrlToImage = (function() {
    var api = {};

    api.render = function(url, file, opts) {
        opts = _.extend({
            width: 1280,
            height: 800,
            ignoreSslErrors: true,
            sslProtocol: 'any'
        }, opts);

        var def = Q.defer();
        var args = [
            path.join(__dirname, 'url-to-image.js'),
            url,
            file,
            opts.width,
            opts.height
        ];
        
        /**
         * Ignore SSL Errors.
         *
         * Takes true / false
         */
        if (opts.ignoreSslErrors) {
          args.unshift('--ignore-ssl-errors');
        }

        if (opts.sslCertificatesPath) {
          args.unshift('--ssl-certificates-path=' + opts.sslCertificatesPath);
        }
        
        /**
         * Set the SSL protocol to be used.
         *
         * Supported protocols:
         * 
         *   - sslv3
         *   - sslv2
         *   - tlsv1
         *   - any
         */
        if (opts.sslProtocol) {
          args.unshift('--ssl-protocol=' + opts.sslProtocol);
        }

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