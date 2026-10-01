import { test } from 'node:test';
import assert from 'node:assert/strict';
import cd from '../../assets/js/terminal/commands/cd.js';
import pwd from '../../assets/js/terminal/commands/pwd.js';
import ls from '../../assets/js/terminal/commands/ls.js';
import registry from '../../assets/js/terminal/registry.js';
import { complete } from '../../assets/js/terminal/shell.js';
import { fakeCtx } from './helpers.mjs';

test('cd moves into a folder through ctx and prints nothing', () => {
    const ctx = fakeCtx();
    assert.deepEqual(cd.run(['posts'], ctx), []);
    assert.deepEqual(ctx.calls.setCwd, ['~/posts']);
});

test('cd with no argument goes home', () => {
    const ctx = fakeCtx({ cwd: '~/projects' });
    cd.run([], ctx);
    assert.equal(ctx.cwd, '~');
});

test('cd to an unknown folder explains and stays put', () => {
    const ctx = fakeCtx();
    assert.deepEqual(cd.run(['nope'], ctx), [{ text: 'cd: nope: no such directory', style: 'error' }]);
    assert.deepEqual(ctx.calls.setCwd, []);
});

test('pwd prints the full path of the current folder', () => {
    assert.deepEqual(pwd.run([], fakeCtx()), ['/home/guest']);
    assert.deepEqual(pwd.run([], fakeCtx({ cwd: '~/posts' })), ['/home/guest/posts']);
});

test('ls with no argument lists the current folder', () => {
    const inPosts = fakeCtx({ cwd: '~/posts' });
    assert.deepEqual(ls.run([], inPosts), ls.run(['posts'], fakeCtx()));
    assert.deepEqual(ls.run([], fakeCtx()), ['posts/  projects/']);
});

test('ls .. and ls <folder> work from inside a folder', () => {
    const ctx = fakeCtx({ cwd: '~/posts' });
    assert.deepEqual(ls.run(['..'], ctx), ['posts/  projects/']);
    assert.deepEqual(ls.run(['projects'], ctx), ls.run(['projects'], fakeCtx()));
});

test('Tab completes folder names for cd and ls', () => {
    assert.deepEqual(complete(registry, 'cd po', fakeCtx()), { line: 'cd posts ', options: [] });
    assert.deepEqual(complete(registry, 'cd p', fakeCtx()), { line: 'cd p', options: ['posts', 'projects'] });
    assert.deepEqual(complete(registry, 'ls pr', fakeCtx()), { line: 'ls projects ', options: [] });
    assert.deepEqual(complete(registry, 'cd .', fakeCtx({ cwd: '~/posts' })), { line: 'cd .. ', options: [] });
});
