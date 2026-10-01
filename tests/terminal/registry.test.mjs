import { test } from 'node:test';
import assert from 'node:assert/strict';
import registry from '../../assets/js/terminal/registry.js';
import { execute } from '../../assets/js/terminal/shell.js';
import { fakeCtx, texts } from './helpers.mjs';

const VISIBLE = ['help', 'ls', 'cd', 'pwd', 'cat', 'open', 'whoami', 'contact', 'theme', 'neofetch', 'history', 'clear', 'exit'];

test('every command has the fields the shell relies on', () => {
    for (const c of registry) {
        assert.equal(typeof c.name, 'string', c.name);
        assert.equal(typeof c.summary, 'string', c.name);
        assert.equal(typeof c.usage, 'string', c.name);
        assert.equal(typeof c.run, 'function', c.name);
    }
});

test('names and aliases are unique', () => {
    const all = registry.flatMap((c) => [c.name, ...(c.aliases || [])]);
    assert.equal(new Set(all).size, all.length);
});

test('visible commands appear in help order; eggs are hidden', () => {
    assert.deepEqual(registry.filter((c) => !c.hidden).map((c) => c.name), VISIBLE);
    assert.deepEqual(registry.filter((c) => c.hidden).map((c) => c.name), ['ask', 'sudo', 'rm']);
});

test('end to end: help through the shell lists every visible command', async () => {
    const out = texts(await execute(registry, 'help', fakeCtx({ registry })));
    for (const name of VISIBLE) {
        assert.ok(out.some((l) => l.trimStart().startsWith(name)), name);
    }
});
