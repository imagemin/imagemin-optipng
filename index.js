'use strict';

var ExecBuffer = require('exec-buffer');
var isPng = require('is-png');
var optipng = require('optipng-bin').path;
var through = require('through2');

/**
 * optipng imagemin plugin
 *
 * @param {Object} file
 * @param {String} enc
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */

function plugin(file, enc, opts, cb) {
	if (file.isNull()) {
		cb(null, file);
		return;
	}

	if (file.isStream()) {
		cb(new Error('Streaming is not supported'));
		return;
	}

	if (!isPng(file.contents)) {
		cb(null, file);
		return;
	}

	var exec = new ExecBuffer();
	var args = ['-strip', 'all', '-quiet', '-clobber'];
	var optimizationLevel = opts.optimizationLevel || 3;

	if (typeof optimizationLevel === 'number') {
		args.push('-o', optimizationLevel);
	}

	exec
		.use(optipng, args.concat(['-out', exec.dest(), exec.src()]))
		.run(file.contents, function (err, buf) {
			if (err) {
				cb(err);
				return;
			}

			file.contents = buf;
			cb(null, file);
		});
}

/**
 * Module exports
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		plugin(file, enc, opts, cb);
	});
};

/**
 * Module exports constructor
 *
 * @param {Object} opts
 * @api public
 */

module.exports.ctor = function (opts) {
	opts = opts || {};

	return through.ctor({ objectMode: true }, function (file, enc, cb) {
		plugin(file, enc, opts, cb);
	});
};
