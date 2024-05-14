## @zaeny/redis

[![npm version](https://img.shields.io/npm/v/@zaeny/mongodb.svg)](https://www.npmjs.com/package/@zaeny/redis)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/redis.svg)  

> Redis functions 

wrap redis node.js driver expose command function and parse returned if json command specific


- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)


### Getting Started

```sh
npm i @zaeny/redis
```

### Usage
parsing json data automaticly, both input json and output json
```js
process.env.REDIS_URL="redis://redisuser:redispass@127.0.0.1:6379"

var client = createRedis(process.env.REDIS_URL);

connectRedis(client)
  .then(()=> console.log('redis connected'));
  
command(['ping'], client).then(console.log)
command(['json.get', 'foo', '$.data'], client)
command(['json.set', 'foo', '$', {data: 1}], client)
command(['json.mget', 'foo', 'bar', '$'], client)
```


### API

```js
createRedis,
connectRedis,
command
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
 - [1.0.0] add `command` and basic parsing json

