## Bolter - the caching framework for node.js

```javascript
var bolter = require('bolter');

cache = bolter({ storage: 'memory' });
f = cache.wrap(function (x) { return x; });

f.cache.on('hit', function (x) {
  console.log('Cache hit for x ===', x);
});

f.cache.on('miss', function (x) {
  console.log('Cache miss for x ===', x);
});

f(1); // Cache miss for x === 1
f(1); // Cache hit for x === 1
```
