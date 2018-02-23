# write-file-atomically

[![npm version](https://img.shields.io/npm/v/write-file-atomically.svg)](https://www.npmjs.com/package/write-file-atomically)
[![Build Status](https://travis-ci.org/shinnn/write-file-atomically.svg?branch=master)](https://travis-ci.org/shinnn/write-file-atomically)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/write-file-atomically.svg)](https://coveralls.io/github/shinnn/write-file-atomically?branch=master)

[Promisified](https://promise-nuggets.github.io/articles/07-wrapping-callback-functions.html) version of [write-file-atomic](https://github.com/npm/write-file-atomic):

> an extension for node's `fs.writeFile` that makes its operation atomic and allows you set ownership (uid/gid of the file)

```javascript
const {readFileSync} = require('fs');
const writeFileAtomically = require('write-file-atomically');

(async () => {
  await writeFileAtomically('file.txt', 'Hi!');
  readFileSync('file.txt', 'utf8'); //=> 'Hi!'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install write-file-atomically
```

## API

```javascript
const writeFileAtomically = require('write-file-atomically');
```

### writeFileAtomically(*filename*, *data* [, *options*])

*filename*: `string`, `Buffer` or [`URL`](https://nodejs.org/api/url.html#url_class_url) (a file path where the file to be written)  
*data*: `string` or `Buffer` (file contents)  
*options*: `Object` or `string` (directly used as [`write-file-atomic` options](https://github.com/npm/write-file-atomic#var-writefileatomic--requirewrite-file-atomicwritefileatomicfilename-data-options-callback))  
Return: `Promise`

It asynchronously writes data to the given file path in an [atomic manner](https://www.npmjs.com/package/write-file-atomic#var-writefileatomic--requirewrite-file-atomic-writefileatomicfilename-data-options-callback):

> The file is initially named `filename + "." + murmurhex(__filename, process.pid, ++invocations)`. If writeFile completes successfully then, if passed the **chown** option it will change the ownership of the file. Finally it renames the file back to the filename you specified.

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
