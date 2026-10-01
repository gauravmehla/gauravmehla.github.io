import { test } from 'node:test';
import assert from 'node:assert/strict';
import neofetch from '../../assets/js/terminal/commands/neofetch.js';
import { LOGO, LOGO_WIDTH } from '../../assets/js/terminal/art.js';
import { fakeCtx } from './helpers.mjs';

const INFO = [
    'guest@mehla.in',
    '--------------',
    'OS: mehla.in',
    'Host: GitHub Pages',
    'Kernel: Jekyll',
    'Shell: guest-sh',
    'Uptime: 10+ years shipping',
    'Theme: paper',
    'Posts: 2',
    'Projects: 2',
    'Stack: Go, Node.js, React',
];

test('the logo is the banner art and LOGO_WIDTH is its widest line', () => {
    assert.equal(LOGO.length, 4);
    assert.equal(LOGO_WIDTH, Math.max(...LOGO.map((l) => l.length)));
});

test('on a wide screen the logo sits left of the info, like the real neofetch', () => {
    const out = neofetch.run([], fakeCtx());
    assert.equal(out.length, INFO.length);
    INFO.forEach((info, i) => {
        const art = (LOGO[i] || '').padEnd(LOGO_WIDTH);
        assert.equal(out[i], `${art}   ${info}`);
    });
});

test('on a narrow screen the info goes under the logo instead', () => {
    const out = neofetch.run([], fakeCtx({ columns: 40 }));
    assert.deepEqual(out, [...LOGO, '', ...INFO]);
});

test('theme and counts come from ctx', () => {
    const ctx = fakeCtx({ columns: 40, theme: 'terminal' });
    ctx.data.posts.pop();
    const out = neofetch.run([], ctx);
    assert.ok(out.includes('Theme: terminal'));
    assert.ok(out.includes('Posts: 1'));
});

test('without site data it still prints, with unknowns', () => {
    const out = neofetch.run([], fakeCtx({ columns: 40, data: null }));
    assert.ok(out.includes('Posts: ?'));
    assert.ok(out.includes('Projects: ?'));
    assert.ok(out.includes('Stack: ?'));
});
