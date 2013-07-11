'use strict';
var bolterMemory = require('./lib/bolter-memory');

module.exports = exports = bolter;


function bolter() {
  return Object.create(bolterMemory);
}

