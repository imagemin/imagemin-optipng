'use strict';

var path = require('path');
var isPng = require('is-png');
var read = require('vinyl-file').read;
var test = require('ava');
var imageminOptipng = require('../');

test('optimize a PNG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.png'), function (err, file) {
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
