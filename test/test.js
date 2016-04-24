import fs from 'fs';
import path from 'path';
import isPng from 'is-png';
import pify from 'pify';
import test from 'ava';
import imageminOptipng from '../';

test('optimize a PNG', async t => {
	const buf = await pify(fs.readFile)(path.join(__dirname, 'fixtures', 'test.png'));
	const data = await imageminOptipng()(buf);

	t.true(data.length < buf.length);
	t.true(isPng(data));
});
