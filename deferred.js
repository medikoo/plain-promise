'use strict';

var Promise = require('./');

var Deferred = module.exports = function () {
    this.promise = Object.create(Promise.prototype);
    this.promise._callbacks = [];
};

Deferred.prototype = {
    resolve: function (value) {
        this.promise._resolve(value);
    },
    reject: function (error) {
        this.promise._reject(error);
    }
};
