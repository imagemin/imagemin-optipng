'use strict';
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const optipng = require('optipng-bin');

module.exports = opts => buf => {
	opts = Object.assign({optimizationLevel: 3}, opts);

	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isPng(buf)) {
		return Promise.resolve(buf);
	}

	const args = [
		'-strip', 'all',
		'-clobber',
		'-force',
		'-fix',
		'-o', opts.optimizationLevel,
		'-out', execBuffer.output,
		execBuffer.input
	];

	return execBuffer({
		input: buf,
		bin: optipng,
		args
	}).catch(err => {
		err.message = err.stderr || err.message;
		throw err;
	});
};
