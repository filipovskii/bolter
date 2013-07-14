'use strict';
var assert = require('assert')
  , bolter = require('../bolter')
  , Q = require('q')
  , redis = require('redis')
  , client = redis.createClient()
  , _ = require('underscore')
  , runCommonTestsFor = require('./bolter-common-test');


describe('bolter-redis', function () {
  var cache, cacheFactory;

  cacheFactory = function () {
    return bolter({
      storage: 'redis'
    });
  };

  beforeEach(function (done) {
    cache = cacheFactory();
    Q.ninvoke(client, 'flushdb').then(function () {
      done();
    });
  });

  it('stores values in redis', function (done) {
    var cachedX;
    function f(x) { return x; }
    cachedX = cache(f);

    cachedX(1)
      .then(function () {
        return Q.ninvoke(client, 'exists', 'f:1');
      }).then(function (cached) {
        assert.ok(cached);
      }).then(function () {
        return cachedX.cache.get('f:1');
      }).then(function (cachedValue) {
        assert.equal(1, cachedValue);
        done();
      }).done();
  });

  it('preserves type of stored value', function (done) {
    var cachedX;
    function f(x) { return x; }
    cachedX = cache(f);

    cachedX(1)
      .then(function () {
        return cachedX(1); // retrieve value from cache
      })
      .then(function (x) {
        assert.ok(_.isNumber(x));
        done();
      }).done();

  });

  runCommonTestsFor(cacheFactory);

});
