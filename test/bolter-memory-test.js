'use strict';
var bolter = require('../bolter')
  , assert = require('assert')
  , _ = require('underscore');


describe('bolter-memory', function () {
  var cache;

  before(function () {
    cache = bolter({ storage: 'memory' });
  });

  it('does not call function if has cached value', function () {
    var calls = 0, cachedX;
    function x() { calls += 1; }
    cachedX = cache.wrap(x);

    cachedX();
    cachedX();

    assert.equal(1, calls);
  });


  it('returns same value that was returned from function', function () {
    var x = 1, cachedFn;
    function fn() { return x++; }

    cachedFn = cache.wrap(fn);

    assert.equal(1, cachedFn());
    assert.equal(1, cachedFn());
  });

  it('does not cache exceptions', function () {
    var times = 0, cachedErrorProne;
    function errorProne() {
      if (times++ === 0) throw new Error('Should not be cached.');
    }

    cachedErrorProne = cache.wrap(errorProne);

    assert.throws(function () {
      cachedErrorProne();
    });

    cachedErrorProne(); //should not throw
  });


  it('caches based on args', function () {
    var calls = []
      , results = []
      , cachedFn;

    function fn(x) { calls.push(x); return x; }

    cachedFn = cache.wrap(fn);

    _.forEach([ 1, 2, 1, 2 ], function (x) {
      results.push(cachedFn(x));
    });

    assert.deepEqual([ 1, 2 ], calls);
    assert.deepEqual([ 1, 2, 1, 2 ], results);
  });

});
