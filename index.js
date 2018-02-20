'use strict';

const {inspect} = require('util');

const writeFileAtomic = require('write-file-atomic');
const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const OPTIONS_SPEC = 'Expected the third argument to be a `write-file-atomic` option (plain <Object>) or a valid encoding (<string>)';
const ENCODING_OPTION_SPEC = 'Expected `encoding` option to be a valid encoding (<string>)';

module.exports = async function writeFileAtomically(...args) {
	const argLen = args.length;

	if (argLen !== 2 && argLen !== 3) {
		throw new RangeError(`Expected 2 or 3 arguments (path: <string>, data: <string|Buffer|Uint8Array>[, options: <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [filename, data] = args;
	let options = args[2];

	if (typeof filename !== 'string') {
		throw new TypeError(`Expected a file path (<string>) to write data, but got a non-string value ${
			inspectWithKind(filename)
		}.`);
	}

	if (typeof options === 'string') {
		if (options.length === 0) {
			const err = new Error(`${OPTIONS_SPEC}, but got an empty string.`);
			err.code = 'ERR_INVALID_ARG_VALUE';

			throw err;
		} else if (!Buffer.isEncoding(options)) {
			const err = new Error(`${OPTIONS_SPEC}, but got an invalid encoding string ${inspect(options)}.`);
			err.code = 'ERR_UNKNOWN_ENCODING';

			throw err;
		}

		options = {encoding: options};
	} else if (argLen === 3) {
		if (!isPlainObj(options)) {
			const err = new TypeError(`${OPTIONS_SPEC}, but got ${inspectWithKind(options)}.`);
			err.code = 'ERR_INVALID_ARG_TYPE';

			throw err;
		}

		const {encoding} = options;

		if (encoding === '') {
			const err = new Error(`${ENCODING_OPTION_SPEC}, but got an empty string.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			throw err;
		}

		if (typeof encoding !== 'string') {
			const err = new TypeError(`${ENCODING_OPTION_SPEC}, but got a non-string value ${
				inspectWithKind(encoding)
			}.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			throw err;
		}

		if (!Buffer.isEncoding(encoding)) {
			const err = new Error(`Expected \`encoding\` option to be a valid encoding, but got an unknown one ${
				inspect(encoding)
			}.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			throw err;
		}
	}

	return new Promise((resolve, reject) => {
		writeFileAtomic(filename, data, options, err => {
			if (err) {
				reject(err);
				return;
			}

			resolve();
		});
	});
};
