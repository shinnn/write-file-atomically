'use strict';

const assert = require('assert');

const fs = require('graceful-fs');
const rimraf = require('rimraf');
const test = require('tape');
const writeFileAtomically = require('.');

test('writeFileAtomically()', t => {
  t.plan(7);

  t.strictEqual(writeFileAtomically.name, 'writeFileAtomically', 'should have a function name.');

  writeFileAtomically('tmp_0.txt', new Buffer('foo')).then(() => {
    t.strictEqual(fs.readFileSync('tmp_0.txt', 'utf8'), 'foo', 'should write a file.');
  }).catch(t.fail);

  writeFileAtomically('tmp_1.txt', 'a0', {encoding: 'hex'}).then(() => {
    t.strictEqual(fs.readFileSync('tmp_1.txt', 'hex'), 'a0', 'should support write-file-atomic options.');
  }).catch(t.fail);

  writeFileAtomically('tmp_2.txt', 'a0', 'hex').then(() => {
    t.strictEqual(fs.readFileSync('tmp_2.txt', 'hex'), 'a0', 'should accept a string as its third argument.');
  }).catch(t.fail);

  writeFileAtomically(__dirname, '').then(t.fail, err => {
    t.strictEqual(err.code, 'EISDIR', 'should fail when it cannot write a file.');
  });

  writeFileAtomically(1, '').then(t.fail, err => {
    t.strictEqual(
      err.message,
      '1 is not a string. Expected a file path to write data.',
      'should fail when the first argument is not a string.'
    );
  });

  writeFileAtomically('tmp_3.txt', '', '123').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Unknown encoding: 123',
      'should fail when it takes an invalid encoding.'
    );
  });

  t.on('end', () => rimraf('tmp*', assert.ifError));
});
