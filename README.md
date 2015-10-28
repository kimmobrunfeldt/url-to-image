# url-to-image

[![Build Status](https://travis-ci.org/kimmobrunfeldt/url-to-image.png?branch=master)](https://travis-ci.org/kimmobrunfeldt/url-to-image)
[![Dependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image)
[![devDependency Status](https://david-dm.org/kimmobrunfeldt/url-to-image/dev-status.png?theme=shields.io)](https://david-dm.org/kimmobrunfeldt/url-to-image#info=devDependencies)

Takes screenshot of a given page. This module correctly handles pages which dynamically load content making AJAX requests.
Instead of waiting fixed amount of time before rendering, we give a short time for the page to make additional requests.

**Usage from code:**

```javascript
var urlToImage = require('url-to-image');
urlToImage('http://google.com', 'google.png').then(function() {
    // now google.png exists and contains screenshot of google.com
}).catch(function(err) {
    console.error(err);
});
```

**Usage from command line:**

```bash
urltoimage http://google.com google.png
```

For more options, see [CLI](##command-line-interface-cli) chapter.

## Install

    npm install url-to-image

PhantomJS is installed by using [Medium/phantomjs NPM module](https://github.com/Medium/phantomjs).

## API

```javascript
var urlToImage = require('url-to-image');
```

#### urlToImage(url, filePath, options)

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

        // How long in ms do we wait for additional requests
        // after all initial requests have gotten their response
        ajaxTimeout: 300,

        // How long in ms do we wait at maximum. The screenshot is
        // taken after this time even though resources are not loaded
        maxTimeout: 1000 * 10,

        // How long in ms do we wait for phantomjs process to finish.
        // If the process is running after this time, it is killed.
        killTimeout: 1000 * 60 * 2,

        // If true, phantomjs script will output requests and responses to stdout
        verbose: false

        // String of of phantomjs arguments, e.g. '--ignore-ssl-errors=true'
        // See options in http://phantomjs.org/api/command-line.html
        phantomArguments: null
    }
    ```

**Returns**

[Bluebird promise object](http://bluebirdjs.com/docs/api-reference.html).

**Detailed example**

```javascript
var urlToImage = require('url-to-image');

var options = {
    width: 600,
    height: 800,
    // Give a short time to load additional resources
    ajaxTimeout: 100
}

urlToImage('http://google.com', 'google.png', options)
.then(function() {
    // do stuff with google.png
})
.catch(function(err) {
    console.error(err);
});
```

## Command line interface (CLI)

The package also ships with a cli called `urltoimage`.

```
Usage: urltoimage <url> <path> [options]

<url>   Url to take screenshot of
<path>  File path where the screenshot is saved


Options:
  --width         Width of the viewport                 [string] [default: 1280]
  --height        Height of the viewport                 [string] [default: 800]
  --ajax-timeout  How long in ms do we wait for additional requests after all
                  initial requests have gotten their response
                                                         [string] [default: 300]
  --max-timeout   How long in ms do we wait at maximum. The screenshot is taken
                  after this time even though resources are not loaded
                                                       [string] [default: 10000]
  --kill-timeout  How long in ms do we wait for phantomjs process to finish. If
                  the process is running after this time, it is killed.
                                                      [string] [default: 120000]
  --verbose       If set, script will output additional information to stdout.
                                                      [boolean] [default: false]
  -h, --help      Show help                                            [boolean]
  -v, --version   Show version number                                  [boolean]

Examples:
  urltoimage http://google.com google.png
```

## Test

    grunt test

You need to have *mocha* installed globally with `npm install -g mocha`.

# Contributors

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
