'use strict';

var assign   = require('es5-ext/object/assign')
  , callable = require('es5-ext/object/valid-callable')
  , path     = require('path')
  , readdir  = require('fs').readdir
  , Mocha    = require("mocha")
  , Promise  = require('./')
  , Deferred = require('./deferred')

  , resolve = path.resolve, extname = path.extname
  , testsDir = resolve(__dirname, 'node_modules/promises-aplus-tests/lib/tests')
  , adapter, ignore;

ignore = {
    '2.3.1': true, // Circular resolution
    '2.3.3': true  // Thenables (support for foreign promises or promise-likes)
};

adapter = {
    resolved: Promise.resolve,
    rejected: Promise.reject,
    deferred: function () { return new Deferred(); }
};

module.exports = function (mochaOpts, cb) {
    if (typeof mochaOpts === "function") {
        cb = mochaOpts;
        mochaOpts = {};
    } else {
        mochaOpts = Object(mochaOpts);
    }
    callable(cb);

    mochaOpts = assign({ timeout: 200, slow: Infinity, bail: true }, mochaOpts);

    readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        var mocha = new Mocha(mochaOpts);
        testFileNames.forEach(function (testFileName) {
            var testFilePath;
            if (extname(testFileName) !== ".js") return;
            if (ignore[testFileName.slice(0, -3)]) return;
            testFilePath = resolve(testsDir, testFileName);
            mocha.addFile(testFilePath);
        });

        global.adapter = adapter;
        mocha.run(function (failures) {
            var err;
            delete global.adapter;
            if (failures > 0) {
                err = new Error("Test suite failed with " + failures + " failures.");
                err.failures = failures;
                cb(err);
            } else {
                cb(null);
            }
        });
    });
};
