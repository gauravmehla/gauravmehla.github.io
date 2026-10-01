import { test } from 'node:test';
import assert from 'node:assert/strict';
import { articleToLines } from '../../assets/js/terminal/post-text.js';

// Minimal stand-in for a DOM element.
const el = (tagName, textContent = '', children = [], className = '') => ({ tagName, textContent, children, className });

test('skips the title and date that the post layout prints', () => {
    const article = el('ARTICLE', '', [el('H1', 'Title'), el('P', 'Sep 30', [], 'post-meta'), el('P', 'Body.')]);
    assert.deepEqual(articleToLines(article), ['Body.']);
});

test('converts headings, lists, quotes, code and rules', () => {
    const article = el('ARTICLE', '', [
        el('P', 'Intro  text\n here.'),
        el('H2', 'Section'),
        el('UL', '', [el('LI', 'one'), el('LI', 'two')]),
        el('OL', '', [el('LI', 'first')]),
        el('BLOCKQUOTE', '\n  Quote\n'),
        el('PRE', 'line 1\nline 2\n'),
        el('HR'),
    ]);
    assert.deepEqual(articleToLines(article), [
        'Intro text here.',
        '',
        { text: 'Section', style: 'heading' },
        '  • one',
        '  • two',
        '',
        '  1. first',
        '',
        '  │ Quote',
        '',
        '    line 1',
        '    line 2',
        '',
        '  ───',
    ]);
});

test('drops empty paragraphs and never ends on a blank line', () => {
    const article = el('ARTICLE', '', [el('P', 'A'), el('P', '   '), el('P', 'B')]);
    assert.deepEqual(articleToLines(article), ['A', '', 'B']);
});
