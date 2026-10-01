import { heading, muted, error, DATA_ERROR } from '../lines.js';
import { resolvePost, ambiguous } from '../resolve.js';

export default {
    name: 'cat',
    summary: 'read a post',
    usage: 'cat <post>',
    complete: (args, ctx) => (ctx.data ? ctx.data.posts.map((p) => p.slug) : []),
    async run(args, ctx) {
        if (args.length === 0) return [error("usage: cat <post>   (see 'ls posts')")];
        if (!ctx.data) return [DATA_ERROR];

        const result = resolvePost(ctx.data.posts, args[0]);
        if (result.matches) return ambiguous('cat', args[0], result.matches);
        if (!result.post) return [error(`cat: ${args[0]}: no such post. Try 'ls posts'.`)];

        const post = result.post;
        let body;
        try {
            body = await ctx.fetchPost(post.url);
        } catch (err) {
            return [error(`cat: couldn't load that post. Try 'open ${post.slug}' instead.`)];
        }

        return [
            heading(post.title),
            muted(post.date),
            '',
            ...body,
            '',
            muted(`→ open ${post.slug} to read it on the page`),
        ];
    },
};
