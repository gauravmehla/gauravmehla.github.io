import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDir, dirName, dirCompletions } from '../../assets/js/terminal/fs.js';

test('no argument, ~ and / all mean home', () => {
    for (const arg of [undefined, '', '~', '~/', '/']) {
        assert.equal(resolveDir('~/posts', arg), '~', String(arg));
    }
});

test('a folder name from home, with or without a trailing slash, in any case', () => {
    assert.equal(resolveDir('~', 'posts'), '~/posts');
    assert.equal(resolveDir('~', 'Projects/'), '~/projects');
    assert.equal(resolveDir('~', '~/posts'), '~/posts');
});

test('.. goes up, and stays at home when already there', () => {
    assert.equal(resolveDir('~/posts', '..'), '~');
    assert.equal(resolveDir('~', '..'), '~');
    assert.equal(resolveDir('~/posts', '.'), '~/posts');
});

test('relative paths through .. work', () => {
    assert.equal(resolveDir('~/posts', '../projects'), '~/projects');
});

test('a sibling folder name works from inside a folder (forgiving, unlike bash)', () => {
    assert.equal(resolveDir('~/posts', 'projects'), '~/projects');
    assert.equal(resolveDir('~/posts', 'posts'), '~/posts');
});

test('unknown or too-deep paths are rejected', () => {
    assert.equal(resolveDir('~', 'nope'), null);
    assert.equal(resolveDir('~', 'posts/hello-world'), null);
});

test('dirName gives the folder name, or null at home', () => {
    assert.equal(dirName('~'), null);
    assert.equal(dirName('~/posts'), 'posts');
});

test('Tab suggestions depend on where you are', () => {
    assert.deepEqual(dirCompletions('~'), ['posts', 'projects']);
    assert.deepEqual(dirCompletions('~/posts'), ['..', 'posts', 'projects']);
});
