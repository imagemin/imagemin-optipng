'use strict';
var ExecBuffer = require('exec-buffer');
var isPng = require('is-png');
var optipng = require('optipng-bin');
var through = require('through2');

module.exports = function (opts) {
	opts = opts || {};

	return through.ctor({objectMode: true}, function (file, enc, cb) {
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

		var execBuffer = new ExecBuffer();
		var args = ['-strip', 'all', '-clobber', '-force', '-fix'];
		var optimizationLevel = opts.optimizationLevel || 2;
		// −nb: Do not apply bit depth reduction
		var keepBitDepth = opts.keepBitDepth || false;
		// −nc: Do not apply color type reduction
		var keepColorType = opts.keepColorType || false;
		// −np: Do not apply palette reduction
		var keepPalette = opts.keepPalette || false;
		// −nz: Do not recode IDAT datastreams
		var keepIDAT = opts.keepIDAT || false;

		if (typeof optimizationLevel === 'number') {
			args.push('-o', optimizationLevel);
		}

		// reduce bit depth
		if (typeof keepBitDepth === 'boolean') {
			if (keepBitDepth === true) {
				args.push('-nb');
			}
		}

		// reduce color type
		if (typeof keepColorType === 'boolean') {
			if (keepColorType === true) {
				args.push('-nc');
			}
		}

		// reduce palette
		if (typeof keepPalette === 'boolean') {
			if (keepPalette === true) {
				args.push('-np');
			}
		}

		// reduce IDAT
		if (typeof keepIDAT === 'boolean') {
			if (keepIDAT === true) {
				args.push('-nz');
			}
		}

		execBuffer
			.use(optipng, args.concat(['-out', execBuffer.dest(), execBuffer.src()]))
			.run(file.contents, function (err, buf) {
				if (err) {
					err.fileName = file.path;
					cb(err);
					return;
				}

				if (buf.length < file.contents.length) {
					file.contents = buf;
				}

				cb(null, file);
			});
	});
};
