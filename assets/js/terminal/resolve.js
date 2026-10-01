// Find a post from what a visitor typed: its number in `ls posts`
// (1 = newest), its full slug, or a unique beginning of the slug.
// Case-insensitive.
import { error } from './lines.js';

// Returns { post } | { matches: [...] } | { notFound: true }.
export function resolvePost(posts, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return { notFound: true };

    if (/^\d+$/.test(q)) {
        const post = posts[Number(q) - 1];
        return post ? { post } : { notFound: true };
    }

    const exact = posts.find((p) => p.slug.toLowerCase() === q);
    if (exact) return { post: exact };

    const matches = posts.filter((p) => p.slug.toLowerCase().startsWith(q));
    if (matches.length === 1) return { post: matches[0] };
    if (matches.length > 1) return { matches };
    return { notFound: true };
}

// Lines explaining that `query` matched several posts.
export function ambiguous(command, query, matches) {
    return [
        error(`${command}: '${query}' matches more than one post:`),
        ...matches.map((p) => `  ${p.slug}`),
    ];
}
