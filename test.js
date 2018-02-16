'use strict';

const {promisify} = require('util');

const {readFile} = require('graceful-fs');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('.');

const promisifiedReadFile = promisify(readFile);

test('writeFileAtomically()', t => {
	t.plan(11);
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

	(async () => {
		const filename = 'tmp_2.txt';

		await writeFileAtomically(filename, 'a0', 'hex');
		t.equal(
			await promisifiedReadFile(filename, 'hex'),
			'a0',
			'should accept a string as its third argument.'
		);
	})();

	const fail = t.fail.bind(t, 'Unexpectedly succceeded.');

	(async () => {
		try {
			await writeFileAtomically(__dirname, '_');
			fail();
		} catch ({code}) {
			t.equal(code, 'EISDIR', 'should fail when it cannot write a file.');
		}
	})();

	(async () => {
		try {
			await writeFileAtomically(1, '_');
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'TypeError: 1 is not a string. Expected a file path to write data.',
				'should fail when it takes a non-string path.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', new WeakMap());
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'TypeError: Expected the third argument to be a `write-file-atomic` option (plain <Object>) or a valid encoding (<string>), but got WeakMap {}.',
				'should fail when it takes a non-plain options object.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', '123');
			fail();
		} catch ({message}) {
			t.equal(
				message,
				'Expected the third argument to be a `write-file-atomic` option (plain <Object>) or a valid encoding (<string>), but got an invalid encoding string \'123\'.',
				'should fail when it takes an invalid encoding string.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', '');
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'Error: Expected the third argument to be a `write-file-atomic` option (plain <Object>) or a valid encoding (<string>), but got an empty string.',
				'should fail when it takes an empty encoding string.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', {encoding: new Uint8Array()});
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'TypeError: Expected `encoding` option to be a valid encoding (<string>), but got a non-string value Uint8Array [  ].',
				'should fail when it takes a non-string encoding option.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', {encoding: ''});
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'Error: Expected `encoding` option to be a valid encoding (<string>), but got an empty string.',
				'should fail when it takes an empty encoding option.'
			);
		}
	})();

	(async () => {
		try {
			await writeFileAtomically('_', '_', {encoding: 'utf7'});
			fail();
		} catch (err) {
			t.equal(
				err.toString(),
				'Error: Expected `encoding` option to be a valid encoding, but got an unknown one \'utf7\'.',
				'should fail when it takes an unknown encoding option.'
			);
		}
	})();
});
