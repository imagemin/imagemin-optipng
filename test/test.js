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

// test: −nb: Do not apply bit depth reduction
test('optimize a PNG, but keep bit depth', async function (t) {
	const stream = imageminOptipng({
		keepBitDepth: true
	})();
	const file = await vinylFile.read(path.join(__dirname, 'fixtures/test.png'));

	stream.on('data', (data) => {
		t.assert(isPng(data.contents));
	});

	stream.end(file);
});

// test: −nc: Do not apply color type reduction
test('optimize a PNG, but keep color type', async function (t) {
	const stream = imageminOptipng({
		keepColorType: true
	})();
	const file = await vinylFile.read(path.join(__dirname, 'fixtures/test.png'));

	stream.on('data', (data) => {
		t.assert(isPng(data.contents));
	});

	stream.end(file);
});

// test: −np: Do not apply palette reduction
test('optimize a PNG, but do not reduce palette', async function (t) {
	const stream = imageminOptipng({
		keepPalette: true
	})();
	const file = await vinylFile.read(path.join(__dirname, 'fixtures/test.png'));

	stream.on('data', (data) => {
		t.assert(isPng(data.contents));
	});

	stream.end(file);
});

// test: −nz: Do not recode IDAT datastreams
test('optimize a PNG, but do not recode IDAT datastreams', async function (t) {
	const stream = imageminOptipng({
		keepIDAT: true
	})();
	const file = await vinylFile.read(path.join(__dirname, 'fixtures/test.png'));

	stream.on('data', (data) => {
		t.assert(isPng(data.contents));
	});

	stream.end(file);
});

