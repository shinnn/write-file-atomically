'use strict';

const writeFileAtomic = require('write-file-atomic');

module.exports = function writeFileAtomically(filename, data, options) {
  if (typeof filename !== 'string') {
    return Promise.reject(new TypeError(
      String(filename) +
      ' is not a string. Expected a file path to write data.'
    ));
  }

  return new Promise(function executor(resolve, reject) {
    writeFileAtomic(filename, data, options, function writeFileAtomicCallback(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
