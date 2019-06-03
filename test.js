import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import test from 'ava';
import optipng from '.';

const fixture = fs.readFileSync(path.join(__dirname, 'fixture.png'));
const fixtureBroken = fs.readFileSync(path.join(__dirname, 'fixture_broken.png'));

test('optimize a PNG', async t => {
	const data = await optipng()(fixture);
	t.true(data.length < fixture.length);
	t.true(isPng(data));
});

test('throw on empty input', async t => {
	await t.throwsAsync(optipng()(), /Expected a buffer/);
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

test('recoverImage default', async t => {
	await t.notThrowsAsync(optipng()(fixtureBroken));
});

test('recoverImage explicit', async t => {
	await t.notThrowsAsync(optipng({recoverImage: true})(fixtureBroken));
});

test('recoverImage is set to false', async t => {
	await t.throwsAsync(optipng({recoverImage: false})(fixtureBroken));
});
