import path from 'path';
import isPng from 'is-png';
import vinylFile from 'vinyl-file';
import test from 'ava';
import imageminOptipng from '../';

test('optimize a PNG', async function (t) {
	const stream = imageminOptipng()();
	const file = await vinylFile.read(path.join(__dirname, 'fixtures/test.png'));
	const size = file.contents.length;

	stream.on('data', data => {
		t.ok(data.contents.length < size, data.contents.length);
		t.true(isPng(data.contents));
	});

	stream.end(file);
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
