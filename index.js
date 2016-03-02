'use strict';

const PinkiePromise = require('pinkie-promise');
const writeFileAtomic = require('write-file-atomic');

module.exports = function writeFileAtomically(filename, data, options) {
  if (typeof filename !== 'string') {
    return PinkiePromise.reject(new TypeError(
      String(filename) +
      ' is not a string. Expected a file path to write data.'
    ));
  }

  return new PinkiePromise(function executor(resolve, reject) {
    writeFileAtomic(filename, data, options, function writeFileAtomicCallback(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
