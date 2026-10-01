import { error, DATA_ERROR } from '../lines.js';
import { resolvePost, ambiguous } from '../resolve.js';

// Targets that don't depend on site data. rss opens in a new tab.
const SITE_TARGETS = { home: '/', rss: '/feed.xml' };

export default {
    name: 'open',
    summary: 'open a post, or github/linkedin/twitter/email/rss/home',
    usage: 'open <target>',
    complete(args, ctx) {
        const site = Object.keys(SITE_TARGETS);
        if (!ctx.data) return site;
        return [...ctx.data.links.map((l) => l.key), ...site, ...ctx.data.posts.map((p) => p.slug)];
    },
    run(args, ctx) {
        if (args.length === 0) return [error('usage: open <target>')];
        const target = args[0].toLowerCase();

        // hasOwn, so 'constructor' and friends aren't treated as targets
        if (Object.hasOwn(SITE_TARGETS, target)) {
            ctx.navigate(SITE_TARGETS[target], { newTab: target === 'rss' });
            return [`opening ${target}…`];
        }

        if (!ctx.data) return [DATA_ERROR];

        const linked = ctx.data.links.find((l) => l.key === target);
        if (linked) {
            ctx.navigate(linked.url, { newTab: !linked.url.startsWith('mailto:') });
            return [`opening ${target}…`];
        }

        const result = resolvePost(ctx.data.posts, target);
        if (result.post) {
            ctx.navigate(result.post.url);
            return [`opening ${result.post.title}…`];
        }
        if (result.matches) return ambiguous('open', args[0], result.matches);
        return [error(`open: ${args[0]}: no such post or link. Try 'ls posts' or 'contact'.`)];
    },
};
