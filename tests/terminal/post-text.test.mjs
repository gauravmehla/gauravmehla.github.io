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

test('keeps line breaks in code blocks wrapped the way Jekyll renders them', () => {
    // Jekyll/rouge output: <div class="language-js highlighter-rouge"><div class="highlight"><pre>…
    const pre = el('PRE', 'const a = 1;\nconst b = 2;\n');
    const inner = el('DIV', pre.textContent, [pre], 'highlight');
    const wrapper = el('DIV', pre.textContent, [inner], 'language-js highlighter-rouge');
    wrapper.querySelector = (sel) => (sel === 'pre' ? pre : null);
    const article = el('ARTICLE', '', [el('P', 'Before.'), wrapper, el('P', 'After.')]);
    assert.deepEqual(articleToLines(article), ['Before.', '', '    const a = 1;', '    const b = 2;', '', 'After.']);
});
