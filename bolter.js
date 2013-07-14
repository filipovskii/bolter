'use strict';
var bolterMemory = require('./lib/bolter-memory')
  , bolterRedis = require('./lib/bolter-redis')
  , Q = require('q')
  , _ = require('underscore')
  , log = require('./lib/log')
  , EventEmitter = require('events').EventEmitter;

module.exports = exports = bolter;


function bolter(config) {

  var cacheMixin;

  if (config.storage === 'memory') { cacheMixin = bolterMemory; }
  if (config.storage === 'redis') { cacheMixin = bolterRedis; }

  return function cacheWrapper(f) {

    var cache, cached;

    cache = Object.create(_.extend(cacheMixin, EventEmitter.prototype));
    cache.name = f.name || '[Anonymous Function]';

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

          return cache.set(key, result);
        });

      });
    };

    cached.cache = cache;
    return cached;

  };
}

