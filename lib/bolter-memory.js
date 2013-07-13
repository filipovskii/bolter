'use strict';
var cacheMixin
  , bolterMemory = {}
  , log = require('./log')
  , EventEmitter = require('events').EventEmitter
  , _ = require('underscore');

module.exports = exports = bolterMemory;


cacheMixin = {

  /**
   * Converts `arguments` to a key to be stored.
   */
  toKey: function () {
    return _.toArray(arguments);
  },

  contains: function () {
    return this.containsKey(this.toKey.apply(this, arguments));
  },

  containsKey: function (key) {
    return _.has(this.storage, key);
  },

  del: function () {
    var args = _.toArray(arguments)
      , key = this.toKey.apply(this, arguments);

    if (this.contains(key)) {
      this.emit.apply(this, [ 'del' ].concat(args));
      delete this.storage[key];
    }
    return this;
  },

  set: function (key, val) {
    this.storage[key] = val;
    return this;
  },

  get: function (key) {
    return this.storage[key];
  }

};




bolterMemory.wrap = function (f) {
  var cache, cached;

  cache = Object.create(_.extend(cacheMixin, EventEmitter.prototype));
  cache.storage = {};

  cached = function cached() {
    var args = _.toArray(arguments)
      , key = cache.toKey(args)
      , callStr = (f.name || '[Anonymous Function]') +
                  '(' + args.join(',') + ')'
      , result;

    if (cache.containsKey(key)) {
      log.debug('Got cahce hit for %s', callStr);
      cache.emit.apply(cache, [ 'hit' ].concat(args));
      return cache.get(key);
    }

    cache.emit.apply(cache, [ 'miss' ].concat(args));

    result = f.apply(undefined, arguments);

    log.debug('Caching %s -> %s', callStr, result);

    cache.set(key, result);

    return result;
  };

  cached.cache = cache;
  return cached;

};
