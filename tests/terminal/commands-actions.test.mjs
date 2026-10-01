import { test } from 'node:test';
import assert from 'node:assert/strict';
import theme from '../../assets/js/terminal/commands/theme.js';
import open from '../../assets/js/terminal/commands/open.js';
import eggs from '../../assets/js/terminal/commands/eggs.js';
import { DATA_ERROR } from '../../assets/js/terminal/lines.js';
import { fakeCtx, texts } from './helpers.mjs';

test('theme with no argument prints the current theme', () => {
    assert.deepEqual(theme.run([], fakeCtx()), ['theme: paper']);
});

test('theme switches through ctx, in any case', () => {
    const ctx = fakeCtx();
    assert.deepEqual(theme.run(['TERMINAL'], ctx), ['theme set to terminal']);
    assert.deepEqual(ctx.calls.setTheme, ['terminal']);
});

test('theme rejects unknown names', () => {
    const ctx = fakeCtx();
    assert.deepEqual(theme.run(['neon'], ctx), [
        { text: "theme: unknown theme 'neon'. Try 'paper' or 'terminal'.", style: 'error' },
    ]);
    assert.deepEqual(ctx.calls.setTheme, []);
});

test('theme completes its two names', () => {
    assert.deepEqual(theme.complete([], fakeCtx()), ['paper', 'terminal']);
});

test('open with no argument shows usage', () => {
    assert.deepEqual(open.run([], fakeCtx()), [{ text: 'usage: open <target>', style: 'error' }]);
});

test('open home and rss work even without site data', () => {
    const ctx = fakeCtx({ data: null });
    assert.deepEqual(open.run(['home'], ctx), ['opening home…']);
    assert.deepEqual(open.run(['rss'], ctx), ['opening rss…']);
    assert.deepEqual(ctx.calls.navigate, [{ url: '/', newTab: false }, { url: '/feed.xml', newTab: true }]);
});

test('open a social link in a new tab, email in the same tab', () => {
    const ctx = fakeCtx();
    open.run(['GitHub'], ctx);
    open.run(['email'], ctx);
    assert.deepEqual(ctx.calls.navigate, [
        { url: 'https://github.com/gauravmehla', newTab: true },
        { url: 'mailto:gaurav@mehla.in', newTab: false },
    ]);
});

test('open a post by number or prefix', () => {
    const ctx = fakeCtx();
    assert.deepEqual(open.run(['1'], ctx), ['opening My Agents Never Said "I Don\'t Know"…']);
    open.run(['hel'], ctx);
    assert.deepEqual(ctx.calls.navigate.map((n) => n.url), ['/blog/my-agents-never-said-i-dont-know', '/blog/hello-world']);
});

test('open lists matches when a prefix is ambiguous', () => {
    const ctx = fakeCtx();
    ctx.data.posts.push({ slug: 'hello-again', title: 'Again', date: '2026-01-01', url: '/blog/hello-again' });
    assert.deepEqual(texts(open.run(['hello-'], ctx)), ["open: 'hello-' matches more than one post:", '  hello-world', '  hello-again']);
    assert.deepEqual(ctx.calls.navigate, []);
});

test('open of something unknown', () => {
    assert.deepEqual(open.run(['nope'], fakeCtx()), [
        { text: "open: nope: no such post or link. Try 'ls posts' or 'contact'.", style: 'error' },
    ]);
});

test('open needs data for links and posts', () => {
    assert.deepEqual(open.run(['github'], fakeCtx({ data: null })), [DATA_ERROR]);
});

test('open completes links, site targets and post slugs', () => {
    const options = open.complete([], fakeCtx());
    for (const t of ['email', 'github', 'home', 'rss', 'hello-world']) assert.ok(options.includes(t), t);
});

test('easter eggs are hidden and reply as specified', () => {
    const byName = Object.fromEntries(eggs.map((c) => [c.name, c]));
    assert.deepEqual(Object.keys(byName), ['ask', 'sudo', 'rm']);
    assert.ok(eggs.every((c) => c.hidden === true));
    assert.deepEqual(byName.ask.run(['are', 'you', 'sure?'], fakeCtx()), ["I don't know."]);
    assert.deepEqual(byName.sudo.run(['ls'], fakeCtx()), ['Nice try. This incident will be reported.']);
    assert.deepEqual(byName.rm.run(['-rf', '/'], fakeCtx()), ['rm: permission denied. Nice try, though.']);
});
