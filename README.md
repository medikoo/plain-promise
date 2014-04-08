# plain-promise
## Simple promise implementation (for educational purposes)

Made for [Asynchronous JavaScript Interfaces]() presentation. To walk through this implementation start with [Promises]() slide.

Provides just basic API and for clarity it's free from any micro and macro optimizations.

It's also proof of concept of how straightforward promise implementation can be with its design is centered around `done` method.

Can safely be used in projects where code size is important, it's definitely one of the smallest published promise implementations.

### Things not covered in this implementation:

##### Circular resolution rejection

Circular resolution of promises is in most cases result of a bug. Promise/A+ demands to throw `TypeError` when such action occurs. It's not in effect (at least currently) in ECMAScript 6 version.
This implementation does not handle that as well (to stay away from additional complexity). Resolving promise with itself leaves promise _resolved_ but in forever locked _unsettled_ state.

##### Support for foreign promises (thenables)

Promise/A+ requires support for foreign (not coming from same implementation) promise objects, it's also specified behavior for ECMAScript 6 promises. Foreign promises assimilation is tricky and to make sure things won't brake (by really _unexpected_ type of implementation) involves numerous security steps.
This logic is not important to understand how promises work, so to keep things simple, this library recognizes just own promises.

##### High level functions `all`, `race` etc.

This implementation focuses just on base promise logic, and any high level functions that operate on promises are out of its scope.

### Example Usage

#### Promise

Promise version of `fs.readFile` for node.js:

```javascript
var fs = require('fs')
var Promise = require('plain-promise');

var readFilePromised = function (path, encoding) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, encoding, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
```

#### Deferred

For reference also _Deferred_ interface is provided (as seperate module)

Promise version of `fs.readFile` for node.js (constructed with _Deferred_ interface)

```javascript
var fs = require('fs')
var Deferred = require('plain-promise/deferred');

var readFilePromised = function (path, encoding) {
  var deferred = new Deferred();
  fs.readFile(path, encoding, function (err, data) {
    if (err) deferred.reject(err);
    else deferred.resolve(data);
    });
  });
  return deferred.promise
};
```

### Installation
#### npm

	$ npm install plain-promise

##### Browser

You can easily bundle _plain-promise_ for browser with any CJS bundler (no favorite? Try: [Browserify](http://browserify.org/), [Webmake](https://github.com/medikoo/modules-webmake) or [Webpack](http://webpack.github.io/))

### Tests

It passes all Promise/A+ tests, apart of 2.3.1 (Circular resolution case) and 2.3.3 (Support for foreign promises).

	$ npm test

