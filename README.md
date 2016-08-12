# write-file-atomically

[![NPM version](https://img.shields.io/npm/v/write-file-atomically.svg)](https://www.npmjs.com/package/write-file-atomically)
[![Build Status](https://travis-ci.org/shinnn/write-file-atomically.svg?branch=master)](https://travis-ci.org/shinnn/write-file-atomically)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/write-file-atomically.svg)](https://coveralls.io/github/shinnn/write-file-atomically?branch=master)
[![dependencies Status](https://david-dm.org/shinnn/write-file-atomically/status.svg)](https://david-dm.org/shinnn/write-file-atomically)
[![devDependencies Status](https://david-dm.org/shinnn/write-file-atomically/dev-status.svg)](https://david-dm.org/shinnn/write-file-atomically?type=dev)

[Promisified](https://promise-nuggets.github.io/articles/07-wrapping-callback-functions.html) version of [write-file-atomic](https://github.com/npm/write-file-atomic):

> Write files in an atomic fashion w/configurable ownership

```javascript
const fs = require('fs');
const writeFileAtomically = require('write-file-atomically');

writeFileAtomically('file.txt', 'Hi!').then(() => {
  fs.readFileSync('file.txt', 'utf8'); //=> 'Hi!' 
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install write-file-atomically
```

## API

```javascript
const writeFileAtomically = require('write-file-atomically');
```

### writeFileAtomically(*filename*, *data* [, *options*])

*filename*: `String` (a file path where the file to be written)  
*data*: `String` or `Buffer` (file contents)  
*options*: `Object` or `String` (directly used as [`write-file-atomic` options](https://github.com/npm/write-file-atomic#var-writefileatomic--requirewrite-file-atomicwritefileatomicfilename-data-options-callback))  
Return: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) instance

It writes data to the given file path with returning a [promise](https://promisesaplus.com/). The promise will be [*fulfilled*](https://promisesaplus.com/#point-26) with no value if successful, otherwise [*rejected*](https://promisesaplus.com/#point-30) with an error.

```javascript
writeFileAtomically(__dirname, '123', {encoding: 'base64'}).catch(err => {
  err.code; //=> 'EISDIR'
});
```

## License

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
