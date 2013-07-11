'use strict';
var bolterMemory = {}
  , log = require('./log')
  , _ = require('underscore');

module.exports = exports = bolterMemory;


bolterMemory.wrap = function (f) {
  var storage = { };

  return function cached() {
    var key = Array.prototype.slice.apply(arguments),
        result;

    if (_.has(storage, key)) return storage[key];

    result = f.apply(undefined, arguments);

    log.debug('Caching %s(%s) -> %s', f.name || '[Function]', key, result);
    storage[key] = result;

    return result;
  };

};
