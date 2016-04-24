import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import m from './';

test(async t => {
	const buf = await pify(fs.readFile)(path.join(__dirname, 'fixture.png'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isPng(data));
});
