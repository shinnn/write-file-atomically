'use strict';

const {promisify} = require('util');

const {readFile} = require('graceful-fs');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('.');

const promisifiedReadFile = promisify(readFile);

test('writeFileAtomically()', t => {
	t.plan(4);
	t.on('end', async () => rmfr('tmp*', {glob: true}));

	(async () => {
		const filename = 'tmp_0.txt';

		await writeFileAtomically(filename, Buffer.from('foo'));
		t.equal(
			await promisifiedReadFile(filename, 'utf8'),
			'foo',
			'should write a file.'
		);
	})();

	(async () => {
		const filename = 'tmp_1.txt';

		await writeFileAtomically(filename, 'a0', {encoding: 'hex'});
		t.equal(
			await promisifiedReadFile(filename, 'hex'),
			'a0',
			'should support write-file-atomic options.'
		);
	})();

	/*
	(async () => {
		const filename = 'tmp_2.txt';

		await writeFileAtomically(filename, 'a0', 'hex');
		t.equal(
			await promisifiedReadFile(filename, 'hex'),
			'a0',
			'should accept a string as its third argument.'
		);
	})();
	*/

	const fail = t.fail.bind(t, 'Unexpectedly succceeded.');

	(async () => {
		try {
			await writeFileAtomically(__dirname, '');
			fail();
		} catch ({code}) {
			t.equal(code, 'EISDIR', 'should fail when it cannot write a file.');
		}
	})();

	(async () => {
		try {
			await writeFileAtomically(1, '');
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'TypeError: 1 is not a string. Expected a file path to write data.',
				'should fail when it takes a non-string path.'
			);
		}
	})();

	/*
	(async () => {
		try {
			await writeFileAtomically('tmp_3.txt', '', '123');
			fail();
		} catch ({message}) {
			t.equal(
				message,
				'Unknown encoding: 123',
				'should fail when it takes an invalid encoding.'
			);
		}
	})();
	*/
});
