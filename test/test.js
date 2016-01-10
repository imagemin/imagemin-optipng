'use strict';
var path = require('path');
var isPng = require('is-png');
var vinylFile = require('vinyl-file');
var test = require('ava');
var imageminOptipng = require('../');

test('optimize a PNG', function (t) {
	t.plan(3);

	vinylFile.read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.assert(!err, err);

		var stream = imageminOptipng()();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size, data.contents.length);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('interlace a PNG', function (t) {
	t.plan(2);

	vinylFile.read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
		t.assert(!err, err);

		var stream = imageminOptipng({
			interlaced: true
		})();

		stream.on('data', function (data) {
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});
