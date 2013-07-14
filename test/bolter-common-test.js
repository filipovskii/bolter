'use strict';
var assert = require('assert');

module.exports = exports = function commonTests(cacheFactory) {

  describe('(shared)', function () {
    var cache;

    beforeEach(function () {
      cache = cacheFactory();
    });

    it('does not call function if has cached value', function (done) {
      var calls = 0, cachedX;
      function x() { calls += 1; }
      cachedX = cache(x);

      cachedX()
        .then(function () {
          cachedX();
        })
        .then(function () {
          assert.equal(1, calls);
          done();
        })
        .done();

    });


    it('returns same value that was returned from fn', function (done) {
      var x = 1, cachedFn;
      function fn() { return x++; }

      cachedFn = cache(fn);

      cachedFn()
        .then(function (x) {
          assert.equal(1, x);
          return cachedFn();
        })
        .then(function (x) {
          assert.equal(1, x);
          done();
        })
        .done();
    });

    it('does not cache exceptions', function (done) {
      var times = 0, cachedErrorProne;
      function errorProne() {
        if (times++ === 0) throw new Error('Should not be cached.');
      }

      cachedErrorProne = cache(errorProne);

      cachedErrorProne().then(undefined, function () { // should throw
        return cachedErrorProne(); // should not throw
      }).then(function () {
        done();
      });
    });


    it('caches based on args', function (done) {
      var calls = []
        , results = []
        , cachedFn;

      function fn(x) { calls.push(x); return x; }

      cachedFn = cache(fn);

      cachedFn(1)
        .then(function (r) { results.push(r); return cachedFn(2); })
        .then(function (r) { results.push(r); return cachedFn(1); })
        .then(function (r) { results.push(r); return cachedFn(2); })
        .then(function (r) {
          results.push(r);

          assert.deepEqual([ 1, 2 ], calls);
          assert.deepEqual([ 1, 2, 1, 2 ], results);
          done();
        }).done();

    });

    it('has `miss` event', function (done) {
      var cachedF;
      function f() {}

      cachedF = cache(f);

      cachedF.cache.on('miss', done);

      cachedF();
    });

    it('passes arguments when omitting miss event', function (done) {
      var cachedF;

      function f(a, b) { return a + b;  }
      cachedF = cache(f);

      cachedF.cache.on('miss', function (a, b) {
        assert.equal('a', a);
        assert.equal('b', b);
        done();
      });

      cachedF('a', 'b');
    });

    it('has `hit` event', function (done) {
      var cachedF;
      function f(x) { return x; }

      cachedF = cache(f);

      cachedF.cache.on('hit', function (x) {
        assert.equal('x', x);
        done();
      });

      cachedF('x').then(function () {
        cachedF('x'); //should emit `hit` event
      });

    });

    it('can del key', function () {
      var calls = [], cachedF;

      function f(x) { calls.push(x); }
      cachedF = cache(f);

      cachedF(1).then(function () {
        return cachedF.cache.del(1);
      }).then(function () {
        return cachedF(1);
      }).then(function () {
        assert.deepEqual([ 1, 1 ], calls);
      });

    });

    it('omit del event if key was stored', function (done) {
      var cachedF;

      function f(x) { return x; }
      cachedF = cache(f);

      cachedF.cache.on('del', function (x) {
        assert.equal(1, x);
        done();
      });

      cachedF(1).then(function () {
        cachedF.cache.del(1);
      });
    });
  });
};
