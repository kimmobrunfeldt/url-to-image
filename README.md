# url-to-image

[![Build Status](https://travis-ci.org/kimmobrunfeldt/url-to-image.png?branch=master)](https://travis-ci.org/kimmobrunfeldt/url-to-image)
[![Dependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image)
[![devDependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image/dev-status.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image#info=devDependencies)

Takes screeshot of a given page. This module correctly handles pages which dynamically load content making AJAX requests.
Instead of waiting fixed amount of time before rendering, we give a short time for the page to make additional requests.

## Usage

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

## Test

    grunt test

You need to have *mocha* installed globally with `npm install -g mocha`.

## Release

* Commit all changes
* Run `grunt release`, which will create new tag and publish code to GitHub

    Travis will release newest tag to NPM

* Edit GitHub release notes


To see an example how to release minor/major, check https://github.com/geddski/grunt-release

## Attribution

This module was inspired by

* [url-to-screenshot](https://github.com/juliangruber/url-to-screenshot)
* https://gist.github.com/cjoudrey/1341747
