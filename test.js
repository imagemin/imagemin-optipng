import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

const fsP = pify(fs);

test('optimize a PNG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture.png'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('throw on empty input', async t => {
	t.throws(m()(), /Expected a buffer/);
});

test('throw on corrupt image', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture-corrupt.png'));
	t.throws(m()(buf), /PNG file appears to be corrupted by text file conversions/);
});
