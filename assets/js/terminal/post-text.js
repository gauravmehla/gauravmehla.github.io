// Turns a post's <article id="post-content"> into terminal lines. Works on
// anything shaped like a DOM element (tagName, className, textContent,
// children), so it's unit-tested without a browser.
import { heading } from './lines.js';

const clean = (text) => String(text).replace(/\s+/g, ' ').trim();

export function articleToLines(article) {
    const lines = [];
    const gap = () => {
        if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('');
    };

    for (const el of Array.from(article.children)) {
        const tag = el.tagName.toUpperCase();
        const classes = String(el.className || '').split(/\s+/);

        // The layout prints the title and date; cat prints its own.
        if (tag === 'H1' || classes.includes('post-meta')) continue;

        if (tag === 'H2' || tag === 'H3') {
            gap();
            lines.push(heading(clean(el.textContent)));
        } else if (tag === 'UL' || tag === 'OL') {
            Array.from(el.children).forEach((li, i) => {
                const marker = tag === 'OL' ? `${i + 1}.` : '•';
                lines.push(`  ${marker} ${clean(li.textContent)}`);
            });
            gap();
        } else if (tag === 'PRE') {
            el.textContent.replace(/\n$/, '').split('\n').forEach((l) => lines.push(`    ${l}`));
            gap();
        } else if (tag === 'BLOCKQUOTE') {
            lines.push(`  │ ${clean(el.textContent)}`);
            gap();
        } else if (tag === 'HR') {
            lines.push('  ───');
            gap();
        } else {
            const text = clean(el.textContent);
            if (text) {
                lines.push(text);
                gap();
            }
        }
    }

    while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    return lines;
}
