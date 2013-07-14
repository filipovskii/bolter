## Bolter - the caching framework for node.js



### In-memory cache (backed by {})

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
f(1).then(function (value) {
    console.log('Result of f(1) is ', value);
  }).done(); // Result of f(1) is 1
```


### Redis cache

```javascript
var bolter = require('bolter');

cache = bolter({ storage: 'redis' });
f = cache(function (x) { return x; }, { /* options */ });

// Everything else is similar to in-memory cache!
```

#### Options

  * **prefix** - prefix of redis key

    default: name of cached function

        f = cache(f);
        f(1); // will store value under f:1 key in redis

        g = cache(g, { prefix: 'g-prefix' });
        g(1); // will store value under g-prefix:1 key in redis


  * **client** - custom redis client,
    see [redis client for node](https://github.com/mranney/node_redis)

    default: bolter will try to connect to standart redis port on localhost
