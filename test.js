import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import test from 'ava';
import m from '.';

const fixture = fs.readFileSync(path.join(__dirname, 'fixture.png'));

test('optimize a PNG', async t => {
	const data = await m()(fixture);
	t.true(data.length < fixture.length);
	t.true(isPng(data));
});

test('throw on empty input', async t => {
	await t.throws(m()(), /Expected a buffer/);
});

test('bitDepthReduction', async t => {
	await t.notThrows(m({bitDepthReduction: true})(fixture));
});

test('colorTypeReduction', async t => {
	await t.notThrows(m({colorTypeReduction: true})(fixture));
});

test('paletteReduction', async t => {
	await t.notThrows(m({paletteReduction: true})(fixture));
});
