# Changelog

API changes across versions

## 0.2.0 -> 1.0.0

* `.done` callback is now: `.then`

    Promise library has been changed to [bluebird](http://bluebirdjs.com/docs/api-reference.html).

* `.fail` callback is now: `.catch`

* `options.ignoreSslErrors` was removed. Use `options.phantomArguments` instead.

    Examples
    ```
    {
        // Note: this is the new default for phantom arguments
        phantomArguments: '--ignore-ssl-errors=true'
    }
    ```

    ```
    urltoimage --phantom-arguments="--ignore-ssl-errors=true" google.com google.png
    ```

    See also: http://phantomjs.org/api/command-line.html

* `options.sslProtocol` was removed. Use `options.phantomArguments` instead.

    See above example.
    See also: http://phantomjs.org/api/command-line.html
