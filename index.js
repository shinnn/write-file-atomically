'use strict';

const inspect = require('util').inspect;

const writeFileAtomic = require('write-file-atomic');
const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const OPTIONS_SPEC = 'Expected the third argument to be a `write-file-atomic` option (plain <Object>) or a valid encoding (<string>)';
const ENCODING_OPTION_SPEC = 'Expected `encoding` option to be a valid encoding (<string>)';

module.exports = function writeFileAtomically(filename, data, options) {
	if (typeof filename !== 'string') {
		return Promise.reject(new TypeError(`${String(filename)} is not a string. Expected a file path to write data.`));
	}

	if (typeof options === 'string') {
		if (options.length === 0) {
			const err = new Error(`${OPTIONS_SPEC}, but got an empty string.`);
			err.code = 'ERR_INVALID_ARG_VALUE';

			return Promise.reject(err);
		} else if (!Buffer.isEncoding(options)) {
			const err = new Error(`${OPTIONS_SPEC}, but got an invalid encoding string ${inspect(options)}.`);
			err.code = 'ERR_UNKNOWN_ENCODING';

			return Promise.reject(err);
		}

		options = {encoding: options};
	} else if (options) {
		if (!isPlainObj(options)) {
			const err = new TypeError(`${OPTIONS_SPEC}, but got ${inspectWithKind(options)}.`);
			err.code = 'ERR_INVALID_ARG_TYPE';

			return Promise.reject(err);
		}

		const encoding = options.encoding;

		if (encoding === '') {
			const err = new Error(`${ENCODING_OPTION_SPEC}, but got an empty string.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			return Promise.reject(err);
		}

		if (typeof encoding !== 'string') {
			const err = new TypeError(`${ENCODING_OPTION_SPEC}, but got a non-string value ${
				inspectWithKind(encoding)
			}.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			return Promise.reject(err);
		}

		if (!Buffer.isEncoding(encoding)) {
			const err = new Error(`Expected \`encoding\` option to be a valid encoding, but got an unknown one ${
				inspect(encoding)
			}.`);
			err.code = 'ERR_INVALID_OPT_VALUE_ENCODING';

			return Promise.reject(err);
		}
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
