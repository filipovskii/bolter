'use strict';
var _ = require('underscore')
  , Q = require('q')
  , redis = require('redis');

exports.mixin = {

  client: redis.createClient(),

  /**
   * Converts `arguments` to a key to be stored.
   */
  toKey: function () {
    var args = _.toArray(arguments)
      , prefix = this.prefix || this.name
      , key = prefix + ':' + _.map(args, function (arg) {
          return JSON.stringify(arg);
        }).join(':');

    return key;
  },

  contains: function () {
    return this.containsKey(this.toKey.apply(this, _.toArray(arguments)));
  },

  containsKey: function (key) {
    return Q.ninvoke(this.client, 'exists', key);
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
    var multi;

    val = JSON.stringify({ data: val });

    if (!_.has(this, 'expire')) {
      return Q.ninvoke(this.client, 'set', key, val);
    }

    multi = this.client.multi()
      .set(key, val)
      .expire(key, this.expire);

    return Q.ninvoke(multi, 'exec');
  },

  get: function (key) {
    return Q.ninvoke(this.client, 'get', key).then(function (cached) {
      return JSON.parse(cached).data;
    });
  }

};
