import { error } from '../lines.js';
import { resolveDir, dirCompletions } from '../fs.js';

export default {
    name: 'cd',
    summary: 'change folder (posts, projects, ..)',
    usage: 'cd [folder]',
    complete: (args, ctx) => dirCompletions(ctx.cwd),
    run(args, ctx) {
        const target = resolveDir(ctx.cwd, args[0]);
        if (!target) return [error(`cd: ${args[0]}: no such directory`)];
        ctx.setCwd(target);
        return [];
    },
};
