var http = require('http');
var fs = require("fs");

var assert = require("assert");
var sizeOf = require('image-size');

var screenshot = require('../');

describe('screenshot', function() {

    var server = http.createServer(function(req, res) {
        res.end('<html>test</html>');
    });

    before(function(done) {
        server.listen(9000);
        server.on('listening', done);
    });

    after(function(done) {
        server.close();
        done();
    });

    describe('render', function() {
        this.timeout(20000);

        it('should render test image', function(done) {
            screenshot('http://localhost:9000', 'localhost.png').done(function() {
                var dimensions = sizeOf('localhost.png');
                assert.equal(dimensions.width, 1280, 'default width is incorrect');
                fs.unlinkSync('localhost.png');
                done();
            });
        });

        it('should render image in custom size', function(done) {
            screenshot(
                'http://localhost:9000',
                'localhost.png', {
                    width: 800,
                    height: 600
                }
            ).done(function() {
                var dimensions = sizeOf('localhost.png');

                assert.equal(dimensions.width, 800, 'width is incorrect');

                // The content of test page is so small, so viewport
                // is larger than content. If content were larger,
                // screenshot's height could be bigger than viewport's width
                assert.equal(dimensions.height, 600, 'height is incorrect');

                fs.unlinkSync('localhost.png');
                done();
            });
        });

        it('should fail', function(done) {
            screenshot(
                'http://failure',
                'localhost.png', {
                    width: 800,
                    height: 600
                }
            ).fail(function(err) {
                done();
            });
        });
    });
});
