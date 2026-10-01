import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, findCommand, execute, complete } from '../../assets/js/terminal/shell.js';
import { fakeCtx } from './helpers.mjs';

const echo = { name: 'echo', summary: 's', usage: 'echo', aliases: ['say'], run: (args) => [args.join(' ')] };
const cat = { name: 'cat', summary: 's', usage: 'cat', complete: () => ['hello-world', 'help-me', 'zeta'], run: () => [] };
const clear = { name: 'clear', summary: 's', usage: 'clear', run: () => [] };
const boom = { name: 'boom', summary: 's', usage: 'boom', run: () => { throw new Error('kaboom'); } };
const later = { name: 'later', summary: 's', usage: 'later', run: async () => ['done'] };
const secret = { name: 'secret', summary: 's', usage: 'secret', hidden: true, run: () => ['shh'] };
const registry = [echo, cat, clear, boom, later, secret];

test('parse splits name and args and lowercases the name', () => {
    assert.deepEqual(parse('  LS   posts  '), { name: 'ls', args: ['posts'] });
    assert.deepEqual(parse(''), { name: '', args: [] });
});

test('findCommand matches names and aliases', () => {
    assert.equal(findCommand(registry, 'echo'), echo);
    assert.equal(findCommand(registry, 'say'), echo);
    assert.equal(findCommand(registry, 'nope'), undefined);
});

test('a blank line does nothing', async () => {
    assert.deepEqual(await execute(registry, '   ', fakeCtx()), []);
});

test('execute runs the command with its args', async () => {
    assert.deepEqual(await execute(registry, 'echo a b', fakeCtx()), ['a b']);
});

test('execute waits for async commands', async () => {
    assert.deepEqual(await execute(registry, 'later', fakeCtx()), ['done']);
});

test('hidden commands still run when typed', async () => {
    assert.deepEqual(await execute(registry, 'secret', fakeCtx()), ['shh']);
});

test('an unknown command explains itself', async () => {
    assert.deepEqual(await execute(registry, 'nope', fakeCtx()), [
        { text: "command not found: nope. Type 'help' to see what's available.", style: 'error' },
    ]);
});

test('markup typed as a command comes back as plain text in a line', async () => {
    const [line] = await execute(registry, '<img src=x onerror=alert(1)>', fakeCtx());
    assert.equal(line.style, 'error');
    assert.match(line.text, /^command not found: <img\./);
});

test('a throwing command reports an error instead of crashing', async (t) => {
    t.mock.method(console, 'error', () => {});
    assert.deepEqual(await execute(registry, 'boom', fakeCtx()), [
        { text: 'boom: something went wrong.', style: 'error' },
    ]);
    assert.equal(console.error.mock.callCount(), 1);
});

test('Tab completes a unique command name', () => {
    assert.deepEqual(complete(registry, 'ec', fakeCtx()), { line: 'echo ', options: [] });
});

test('Tab lists options when several commands match', () => {
    assert.deepEqual(complete(registry, 'c', fakeCtx()), { line: 'c', options: ['cat', 'clear'] });
});

test('Tab never suggests hidden commands', () => {
    assert.deepEqual(complete(registry, 'sec', fakeCtx()), { line: 'sec', options: [] });
});

test("Tab completes arguments using the command's complete()", () => {
    assert.deepEqual(complete(registry, 'cat z', fakeCtx()), { line: 'cat zeta ', options: [] });
});

test('Tab extends to the shared prefix of several matches', () => {
    assert.deepEqual(complete(registry, 'cat h', fakeCtx()), { line: 'cat hel', options: ['hello-world', 'help-me'] });
});

test('Tab does nothing for commands without complete()', () => {
    assert.deepEqual(complete(registry, 'echo x', fakeCtx()), { line: 'echo x', options: [] });
});
