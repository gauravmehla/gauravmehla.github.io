import { test } from 'node:test';
import assert from 'node:assert/strict';
import help from '../../assets/js/terminal/commands/help.js';
import ls from '../../assets/js/terminal/commands/ls.js';
import whoami from '../../assets/js/terminal/commands/whoami.js';
import contact from '../../assets/js/terminal/commands/contact.js';
import history from '../../assets/js/terminal/commands/history.js';
import clear from '../../assets/js/terminal/commands/clear.js';
import exit from '../../assets/js/terminal/commands/exit.js';
import { DATA_ERROR } from '../../assets/js/terminal/lines.js';
import { fakeCtx, texts } from './helpers.mjs';

const egg = { name: 'ask', summary: 'x', usage: 'ask', hidden: true, run: () => [] };

test('help lists visible commands with usage and summary, and hides eggs', () => {
    const ctx = fakeCtx({ registry: [help, ls, egg] });
    const out = texts(help.run([], ctx));
    assert.equal(out[0], 'Commands');
    assert.ok(out.some((l) => l.includes('ls [posts|projects]') && l.includes('list posts and projects')));
    assert.ok(!out.some((l) => l.includes('ask')));
    assert.equal(out[out.length - 1], 'Tab completes · ↑ ↓ history · Esc closes');
});

test('help <command> shows its usage', () => {
    const ctx = fakeCtx({ registry: [help, ls, egg] });
    assert.deepEqual(texts(help.run(['ls'], ctx)), ['ls [posts|projects]', 'list posts and projects']);
});

test('help never reveals hidden commands', () => {
    const ctx = fakeCtx({ registry: [help, ls, egg] });
    assert.deepEqual(help.run(['ask'], ctx), [{ text: 'help: no such command: ask', style: 'error' }]);
});

test('ls with no argument shows the two directories', () => {
    assert.deepEqual(ls.run([], fakeCtx()), ['posts/  projects/']);
});

test('ls posts numbers posts newest first', () => {
    assert.deepEqual(ls.run(['posts'], fakeCtx()), [
        '  1  2026-09-30  My Agents Never Said "I Don\'t Know"',
        '  2  2026-03-09  Hello World',
    ]);
});

test('ls accepts a trailing slash and any case', () => {
    assert.deepEqual(ls.run(['POSTS/'], fakeCtx()), ls.run(['posts'], fakeCtx()));
});

test('ls posts says so when there are none', () => {
    const ctx = fakeCtx();
    ctx.data.posts = [];
    assert.deepEqual(ls.run(['posts'], ctx), ['(no posts yet)']);
});

test('ls projects shows name, description and tech', () => {
    assert.deepEqual(ls.run(['projects'], fakeCtx()), [
        { text: 'Admin Platform', style: 'heading' },
        '  An internal platform.',
        { text: '  Go / Kubernetes', style: 'muted' },
        '',
        { text: 'The JavaScript Workshop', style: 'heading' },
        '  A book.',
        { text: '  Packt Publishing', style: 'muted' },
    ]);
});

test('ls of an unknown directory', () => {
    assert.deepEqual(ls.run(['nope'], fakeCtx()), [
        { text: "ls: cannot access 'nope': no such directory", style: 'error' },
    ]);
});

test('commands that need site data say so when it failed to load', () => {
    const ctx = fakeCtx({ data: null });
    assert.deepEqual(ls.run(['posts'], ctx), [DATA_ERROR]);
    assert.deepEqual(whoami.run([], ctx), [DATA_ERROR]);
    assert.deepEqual(contact.run([], ctx), [DATA_ERROR]);
    assert.deepEqual(ls.run([], ctx), ['posts/  projects/']);
});

test('whoami prints the bio with a blank line between paragraphs', () => {
    assert.deepEqual(whoami.run([], fakeCtx()), ['First paragraph.', '', 'Second paragraph.']);
});

test('contact prints aligned, clickable links; email stays in the same tab', () => {
    assert.deepEqual(contact.run([], fakeCtx()), [
        { text: 'Email   gaurav@mehla.in', href: 'mailto:gaurav@mehla.in', newTab: false },
        { text: 'GitHub  github.com/gauravmehla', href: 'https://github.com/gauravmehla', newTab: true },
    ]);
});

test('history numbers the commands typed this visit', () => {
    const ctx = fakeCtx({ history: ['ls', 'history'] });
    assert.deepEqual(history.run([], ctx), ['  1  ls', '  2  history']);
});

test('clear and exit act through ctx and print nothing', () => {
    const ctx = fakeCtx();
    assert.deepEqual(clear.run([], ctx), []);
    assert.deepEqual(exit.run([], ctx), []);
    assert.equal(ctx.calls.clear, 1);
    assert.equal(ctx.calls.close, 1);
});
