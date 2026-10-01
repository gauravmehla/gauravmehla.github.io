import { test } from 'node:test';
import assert from 'node:assert/strict';
import cat from '../../assets/js/terminal/commands/cat.js';
import { DATA_ERROR } from '../../assets/js/terminal/lines.js';
import { fakeCtx, texts } from './helpers.mjs';

test('cat with no argument shows usage', async () => {
    assert.deepEqual(await cat.run([], fakeCtx()), [{ text: "usage: cat <post>   (see 'ls posts')", style: 'error' }]);
});

test('cat needs site data', async () => {
    assert.deepEqual(await cat.run(['1'], fakeCtx({ data: null })), [DATA_ERROR]);
});

test('cat prints title, date, body and a pointer to the page', async () => {
    const ctx = fakeCtx();
    assert.deepEqual(await cat.run(['hello'], ctx), [
        { text: 'Hello World', style: 'heading' },
        { text: '2026-03-09', style: 'muted' },
        '',
        'Body paragraph.',
        '',
        { text: '→ open hello-world to read it on the page', style: 'muted' },
    ]);
    assert.deepEqual(ctx.calls.fetchPost, ['/blog/hello-world']);
});

test('cat of an unknown post', async () => {
    assert.deepEqual(await cat.run(['nope'], fakeCtx()), [
        { text: "cat: nope: no such post. Try 'ls posts'.", style: 'error' },
    ]);
});

test('cat lists matches for an ambiguous prefix', async () => {
    const ctx = fakeCtx();
    ctx.data.posts.push({ slug: 'hello-again', title: 'Again', date: '2026-01-01', url: '/blog/hello-again' });
    assert.deepEqual(texts(await cat.run(['hello-'], ctx)), ["cat: 'hello-' matches more than one post:", '  hello-world', '  hello-again']);
});

test('cat explains when the post page fails to load', async () => {
    const ctx = fakeCtx({ fetchPost: async () => { throw new Error('offline'); } });
    assert.deepEqual(await cat.run(['2'], ctx), [
        { text: "cat: couldn't load that post. Try 'open hello-world' instead.", style: 'error' },
    ]);
});

test('cat completes post slugs', () => {
    assert.deepEqual(cat.complete([], fakeCtx()), ['my-agents-never-said-i-dont-know', 'hello-world']);
    assert.deepEqual(cat.complete([], fakeCtx({ data: null })), []);
});
