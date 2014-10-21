'use strict';

var File = require('vinyl');
var fs = require('fs');
var isPng = require('is-png');
var optipng = require('../');
var path = require('path');
var test = require('ava');

test('optimize a PNG', function (t) {
	t.plan(3);

	fs.readFile(path.join(__dirname, 'fixtures/test.png'), function (err, buf) {
		t.assert(!err);

		var stream = optipng();
		var file = new File({
			contents: buf
		});

		stream.on('data', function (data) {
			t.assert(data.contents.length < buf.length);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});

test('optimize a PNG using ctor', function (t) {
	t.plan(3);

	var Optipng = optipng.ctor();

	fs.readFile(path.join(__dirname, 'fixtures/test.png'), function (err, buf) {
		t.assert(!err);

		var stream = new Optipng();
		var file = new File({
			contents: buf
		});

		stream.on('data', function (data) {
			t.assert(data.contents.length < buf.length);
			t.assert(isPng(data.contents));
		});

		stream.end(file);
	});
});
