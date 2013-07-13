'use strict';
var bolterMemory = {}
  , log = require('./log')
  , EventEmitter = require('events').EventEmitter
  , _ = require('underscore');

module.exports = exports = bolterMemory;


bolterMemory.wrap = function (f) {
  var storage = { }, cached;

  cached = function cached() {
    var args = Array.prototype.slice.apply(arguments)
      , key = args
      , result;

    if (_.has(storage, key)) {
      cached.emit.apply(cached, [ 'hit' ].concat(args));
      return storage[key];
    }

    cached.emit.apply(cached, [ 'miss' ].concat(args));

    result = f.apply(undefined, arguments);

    log.debug('Caching %s(%s) -> %s',
        f.name || '[Anonymous Function]', key, result);

    storage[key] = result;

    return result;
  };

  cached.del = function del() {
    var args = Array.prototype.slice.apply(arguments)
      , key = args;

    if (_.has(storage, key)) {
      cached.emit.apply(cached, [ 'del' ].concat(args));
      delete storage[key];
    }
    return cached;
  };

  return _.extend(cached, EventEmitter.prototype);

};
