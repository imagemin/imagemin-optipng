import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

test('optimize a PNG', async t => {
	const buf = await pify(fs.readFile)(path.join(__dirname, 'fixture.png'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isPng(data));
});

test('throw on empty input', async t => {
	t.throws(m()(), /Expected a buffer/);
});
