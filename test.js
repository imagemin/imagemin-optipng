const fs = require('fs');
const path = require('path');
const isPng = require('is-png');
const test = require('ava');
const optipng = require('.');

const fixture = fs.readFileSync(path.join(__dirname, 'fixture.png'));
const fixtureBroken = fs.readFileSync(path.join(__dirname, 'fixture_broken.png'));

test('optimize a PNG', async t => {
	const data = await optipng()(fixture);
	t.true(data.length < fixture.length);
	t.true(isPng(data));
});

test('throw on empty input', async t => {
	await t.throwsAsync(optipng()(), {message: /Expected a buffer/});
});

test('bitDepthReduction option', async t => {
	await t.notThrowsAsync(optipng({bitDepthReduction: true})(fixture));
});

test('colorTypeReduction option', async t => {
	await t.notThrowsAsync(optipng({colorTypeReduction: true})(fixture));
});

test('paletteReduction option', async t => {
	await t.notThrowsAsync(optipng({paletteReduction: true})(fixture));
});

test('errorRecovery default', async t => {
	const data = await optipng()(fixtureBroken);
	t.true(isPng(data));
});

test('errorRecovery explicit', async t => {
	const data = await optipng({errorRecovery: true})(fixtureBroken);
	t.true(isPng(data));
});

test('errorRecovery is set to false', async t => {
	await t.throwsAsync(optipng({errorRecovery: false})(fixtureBroken));
});

test('interlaced is set to true', async t => {
	const [data1, data2] = await Promise.all([
		optipng({interlaced: true})(fixture),
		optipng()(fixture)
	]);

	t.true(isPng(data1));
	t.true(data1.length > data2.length);
});

test('interlaced is set to undefined and null', async t => {
	const [data1, data2, data3] = await Promise.all([
		optipng({interlaced: undefined})(fixture),
		optipng({interlaced: null})(fixture),
		optipng({interlaced: true})(fixture)
	]);

	t.true(isPng(data1) && isPng(data2));
	t.true(data1.length === data2.length && data1.length < data3.length);
});
