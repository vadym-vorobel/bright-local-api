# NodeJS BrightLocal API

A basic NodeJS wrapper to make using the BrightLocal API a little easier. It takes care of authentication so you just need to specify which method you want to call and pass parameters.
Based on [BrightLocal PHP wrapper](https://github.com/BrightLocal/BrightLocal-API-Helper).

## Installation

`npm i -S bright-local-api`

## Examples

You need to export `Api` and `V4` (for batch requests) classes at first.


```js
// ES5
var BrightLocal = require('bright-local-api');
var Api = BrightLocal.Api;
var BatchApiV4 = BrightLocal.V4;
````

```js
// ES6
import { Api, V4 } from 'bright-local-api';
```

```js
const api = new Api(API_KEY, API_SECRET);

api.get('/v1/clients-and-locations/locations/search', { q: 'Cafe' })
  .then(response => console.log(response));
```

> **note* `Api#call`, `Api#get`, `Api#post`, `Api#put`, `Api#delete` returns a Promise.

For more details visit [BrightLocal API Documentation page](http://apidocs.brightlocal.com/). 
