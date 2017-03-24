import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

const fsP = pify(fs);

let buf;
let corrupt;

test.before(async () => {
	buf = await fsP.readFile(path.join(__dirname, 'fixture.png'));
	corrupt = await fsP.readFile(path.join(__dirname, 'fixture-corrupt.png'));
});

test('optimize a PNG', async t => {
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('throw on empty input', t => {
	t.throws(m()(), /Expected a buffer/);
});

test('throw on corrupt image', t => {
	t.throws(m()(corrupt), /PNG file appears to be corrupted by text file conversions/);
});

test('bitDepthReduction', async t => {
	await t.notThrows(m({bitDepthReduction: true})(buf));
});

test('colorTypeReduction', async t => {
	await t.notThrows(m({colorTypeReduction: true})(buf));
});

test('paletteReduction', async t => {
	await t.notThrows(m({paletteReduction: true})(buf));
});
