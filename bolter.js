'use strict';
var Q = require('q')
  , _ = require('underscore')
  , log = require('./lib/log')
  , EventEmitter = require('events').EventEmitter;

module.exports = exports = bolter;

Q.longStackSupport = true;

function bolter(config) {

  if (!config.storage) throw new Error(
      'Name storage for cache. `memory` and `redis` available');

  var module = require('./lib/bolter-' + config.storage)
    , cacheMixin = module.mixin
    , defaults = module.defaults || function () { return {}; };

  return function cacheWrapper(f, cacheConfig) {

    var cache, cached;

    cache = Object.create(_.extend(cacheMixin, EventEmitter.prototype));
    cache.name = f.name || '[Anonymous Function]';
    cache = _.extend(cache, defaults(), cacheConfig);

    cached = function cached() {
      var args = _.toArray(arguments)
        , key = cache.toKey.apply(cache, args)
        , callStr = cache.name + '(' + args.join(',') + ')';

      return cache.containsKey(key).then(function (containsKey) {

        if (containsKey) {
          log.debug('Got cahce hit for %s', callStr);
          cache.emit.apply(cache, [ 'hit' ].concat(args));
          return cache.get(key);
        }

        cache.emit.apply(cache, [ 'miss' ].concat(args));

        return Q.when(f.apply(undefined, args)).then(function (result) {
          log.debug('Caching %s -> %s', callStr, result);

          return cache.set(key, result).then(function () {
            return result; // preserve actual function result
          });
        });

      });
    };

    cached.cache = cache;
    return cached;

  };
}

