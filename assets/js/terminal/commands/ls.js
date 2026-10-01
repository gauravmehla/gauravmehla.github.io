import { heading, muted, error, DATA_ERROR } from '../lines.js';
import { resolveDir, dirName, dirCompletions } from '../fs.js';

function listPosts(posts) {
    if (posts.length === 0) return ['(no posts yet)'];
    return posts.map((p, i) => `${String(i + 1).padStart(3)}  ${p.date}  ${p.title}`);
}

function listProjects(projects) {
    return projects
        .flatMap((p) => ['', heading(p.name), `  ${p.description}`, muted(`  ${p.tech}`)])
        .slice(1);
}

export default {
    name: 'ls',
    summary: 'list posts and projects',
    usage: 'ls [folder]',
    complete: (args, ctx) => dirCompletions(ctx.cwd),
    run(args, ctx) {
        const target = args.length > 0 ? resolveDir(ctx.cwd, args[0]) : ctx.cwd;
        if (!target) return [error(`ls: cannot access '${args[0]}': no such directory`)];

        const dir = dirName(target);
        if (!dir) return ['posts/  projects/'];
        if (!ctx.data) return [DATA_ERROR];
        return dir === 'posts' ? listPosts(ctx.data.posts) : listProjects(ctx.data.projects);
    },
};
