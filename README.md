# url-to-image

[![Build Status](https://travis-ci.org/kimmobrunfeldt/url-to-image.png?branch=master)](https://travis-ci.org/kimmobrunfeldt/url-to-image)

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

    npm test

You need to have *mocha* installed globally with `npm install -g mocha`.

## Releasing

* Edit [changelog][changelog.md]
* `grunt publish`

    It will run tests and publish code to GitHub and npm


## Attribution

This module was inspired by

* [url-to-screenshot](https://github.com/juliangruber/url-to-screenshot)
* https://gist.github.com/cjoudrey/1341747
