# url-to-image

[![Build Status](https://travis-ci.org/kimmobrunfeldt/url-to-image.png?branch=master)](https://travis-ci.org/kimmobrunfeldt/url-to-image)
[![Dependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image)
[![devDependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image/dev-status.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image#info=devDependencies)

Takes screenshot of a given page. This module correctly handles pages which dynamically load content making AJAX requests.
Instead of waiting fixed amount of time before rendering, we give a short time for the page to make additional requests.

**Example usage**

```javascript
var screenshot = require('url-to-image');
screenshot('http://google.com', 'google.png').fail(function(err) {
    console.error(err);
}).done(function() {
    // now google.png exists and contains screenshot of google.com
});
```

## Install

    npm install url-to-image

You need to have [PhantomJS](http://phantomjs.org/) installed globally. `phantomjs` executable also needs to be in your PATH.

## Api

```javascript
var screenshot = require('url-to-image');
```

#### screenshot(url, filePath, options)

This will run a PhantomJS script([url-to-image.js](url-to-image.js)) which renders given url to an image.

**Parameters**

* `url` Url of the page which will be rendered as image. For example `http://google.com`.
* `filePath` File path where to save rendered image.
* `options` Options for page rendering.

    **Default values for options**

    ```javascript
    {
        // User agent width
        width: 1200,

        // User agent height
        height: 800,

        // If true, SSL errors are ignored. Default true.
        ignoreSslErrors: true,

        // Set SSL protocol. Default: any. One of: sslv3, sslv2, tlsv1, any
        sslProtocol: 'any'
    }
    ```

**Returns**

[Q promise object](https://github.com/kriskowal/q/wiki/API-Reference#promise-methods). In case of error, stderr is passed as a string to fail handler.

**Detailed example**

```javascript
var screenshot = require('url-to-image');

var options = {
    width: 600,
    height: 800
}

var promise = screenshot('http://google.com', 'google.png', options);
promise.fail(function(stderr) {
    console.error(stderr);
}).done(function() {
    // do stuff with google.png
});
```


## Test

    grunt test

You need to have *mocha* installed globally with `npm install -g mocha`.

## Release

* Commit all changes.
* Run `grunt release`, which will create new tag and publish code to GitHub.

    Travis will release newest tag to NPM

* Edit GitHub release notes.


To see an example how to release minor/major, check https://github.com/geddski/grunt-release

## Attribution

This module was inspired by

* [url-to-screenshot](https://github.com/juliangruber/url-to-screenshot)
* https://gist.github.com/cjoudrey/1341747

# License

MIT
