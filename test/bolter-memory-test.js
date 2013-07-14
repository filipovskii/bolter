'use strict';
var bolter = require('../bolter')
  , runCommonTestsFor = require('./bolter-common-test');


describe('bolter-memory', function () {
  var cacheFactory = function () {
    return bolter({ storage: 'memory' });
  };

  runCommonTestsFor(cacheFactory);

});
