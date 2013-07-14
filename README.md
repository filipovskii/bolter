## Bolter - the caching framework for node.js



### In-memory cache (backed by *{}*)

```javascript
var bolter = require('bolter');

cache = bolter({ storage: 'memory' });
f = cache(function (x) { return x; });

f.cache.on('hit', function (x) {
  console.log('Cache hit for x ===', x);
});

f.cache.on('miss', function (x) {
  console.log('Cache miss for x ===', x);
});

f(1); // Cache miss for x === 1
f(1); // Cache hit for x === 1
f(1)
  .then(function (value) {
    console.log('Result of f(1) is ', value);
  })
  .done();
```
