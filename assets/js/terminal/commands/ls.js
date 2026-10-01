import { heading, muted, error, DATA_ERROR } from '../lines.js';

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
    usage: 'ls [posts|projects]',
    complete: () => ['posts', 'projects'],
    run(args, ctx) {
        const dir = (args[0] || '').replace(/\/$/, '').toLowerCase();
        if (!dir) return ['posts/  projects/'];
        if (dir !== 'posts' && dir !== 'projects') {
            return [error(`ls: cannot access '${args[0]}': no such directory`)];
        }
        if (!ctx.data) return [DATA_ERROR];
        return dir === 'posts' ? listPosts(ctx.data.posts) : listProjects(ctx.data.projects);
    },
};
