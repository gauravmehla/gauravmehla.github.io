import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heading, muted, error, link, STYLES, DATA_ERROR } from '../../assets/js/terminal/lines.js';

test('style helpers tag lines with a known style', () => {
    assert.deepEqual(heading('A'), { text: 'A', style: 'heading' });
    assert.deepEqual(muted('B'), { text: 'B', style: 'muted' });
    assert.deepEqual(error('C'), { text: 'C', style: 'error' });
    for (const line of [heading('x'), muted('x'), error('x'), DATA_ERROR]) {
        assert.ok(STYLES.includes(line.style));
    }
});

test('link opens in the same tab unless told otherwise', () => {
    assert.deepEqual(link('GitHub', 'https://github.com'), { text: 'GitHub', href: 'https://github.com', newTab: false });
    assert.equal(link('x', 'y', true).newTab, true);
});

test('DATA_ERROR tells the visitor what to do', () => {
    assert.deepEqual(DATA_ERROR, { text: "couldn't load site data. Try refreshing the page.", style: 'error' });
});
