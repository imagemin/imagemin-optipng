import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

let buf;
let badBuf;
const fsP = pify(fs);

test.before(async () => {
	buf = await fsP.readFile(path.join(__dirname, 'fixture.png'));
	badBuf = await fsP.readFile(path.join(__dirname, 'fixture-corrupt.png'));
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
	t.throws(m()(badBuf), /PNG file appears to be corrupted by text file conversions/);
});

['bitDepthReduction', 'colorTypeReduction', 'paletteReduction'].forEach(key =>
	test(`using ${key} doesn't throw`, t => {
		t.notThrows(m({[key]: true})(buf));
		t.notThrows(m({[key]: false})(buf));
	})
);
