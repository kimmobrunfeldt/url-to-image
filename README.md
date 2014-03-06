# url-to-image

[![Build Status](https://travis-ci.org/kimmobrunfeldt/url-to-image.png?branch=master)](https://travis-ci.org/kimmobrunfeldt/url-to-image)

Takes screeshot of a given page. This module correctly handles pages which dynamically load content making AJAX requests.
Instead of waiting fixed amount of time before rendering, we give a short time for the page to make additional requests.

## Usage

```javascript
var screenshot = require('url-to-image');
screenshot('http://google.com', 'google.png').done(function() {
    // now google.png exists and contains screenshot of google.com
}).fail(function(err) {
    console.error(err);
});
```

## Install

    npm install url-to-image

## Test

    npm test
