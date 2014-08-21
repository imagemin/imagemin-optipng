/*global describe, it */
'use strict';

var assert = require('assert');
var fs = require('fs');
var Imagemin = require('imagemin');
var optipng = require('../');
var path = require('path');

describe('optipng()', function () {
	it('should optimize a PNG', function (cb) {
		var imagemin = new Imagemin();

		imagemin
			.src(path.join(__dirname, 'fixtures/test.png'))
			.use(optipng())
			.optimize(function (err, file) {
				assert(file.contents.length < fs.statSync(imagemin.src()).size);
				assert(file.contents.length > 0);
				cb();
			});
	});
});
