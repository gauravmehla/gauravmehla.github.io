import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePost, ambiguous } from '../../assets/js/terminal/resolve.js';
import { DATA } from './helpers.mjs';

const posts = DATA.posts;

test('a number picks from `ls posts` order (1 = newest)', () => {
    assert.equal(resolvePost(posts, '1').post.slug, 'my-agents-never-said-i-dont-know');
    assert.equal(resolvePost(posts, '2').post.slug, 'hello-world');
});

test('out-of-range numbers are not found', () => {
    assert.deepEqual(resolvePost(posts, '0'), { notFound: true });
    assert.deepEqual(resolvePost(posts, '3'), { notFound: true });
});

test('a full slug matches, case-insensitively', () => {
    assert.equal(resolvePost(posts, 'HELLO-WORLD').post.slug, 'hello-world');
});

test('a unique prefix matches', () => {
    assert.equal(resolvePost(posts, 'my-ag').post.slug, 'my-agents-never-said-i-dont-know');
});

test('an ambiguous prefix returns every match', () => {
    const many = [...posts, { slug: 'hello-again', title: 'Again', date: '2026-01-01', url: '/blog/hello-again' }];
    assert.deepEqual(resolvePost(many, 'hello').matches.map((p) => p.slug), ['hello-world', 'hello-again']);
});

test('an exact slug wins over longer slugs it is a prefix of', () => {
    const p = [{ slug: 'hello' }, { slug: 'hello-world' }];
    assert.equal(resolvePost(p, 'hello').post.slug, 'hello');
});

test('empty and unknown queries are not found', () => {
    assert.deepEqual(resolvePost(posts, ''), { notFound: true });
    assert.deepEqual(resolvePost(posts, '   '), { notFound: true });
    assert.deepEqual(resolvePost(posts, 'nope'), { notFound: true });
});

test('ambiguous() explains the problem and lists the slugs', () => {
    const lines = ambiguous('cat', 'hello', [{ slug: 'a' }, { slug: 'b' }]);
    assert.deepEqual(lines, [
        { text: "cat: 'hello' matches more than one post:", style: 'error' },
        '  a',
        '  b',
    ]);
});
