'use strict';
var Q = require('q')
  , _ = require('underscore');


exports.defaults = function () { return { storage: {} }; };

exports.mixin = {

  /**
   * Converts `arguments` to a key to be stored.
   */
  toKey: function () {
    return _.toArray(arguments);
  },

  contains: function () {
    return this.containsKey(this.toKey.apply(this, _.toArray(arguments)));
  },

  containsKey: function (key) {
    return Q.when(_.has(this.storage, key));
  },

  del: function () {
    var args = _.toArray(arguments)
      , key = this.toKey.apply(this, arguments);

    if (!this.containsKey(key)) return Q.when(false);

    this.emit.apply(this, [ 'del' ].concat(args));
    delete this.storage[key];
    return Q.when(true);
  },

  set: function (key, val) {
    this.storage[key] = val;
    return Q.when(true);
  },

  get: function (key) {
    return Q.when(this.storage[key]);
  }

};
