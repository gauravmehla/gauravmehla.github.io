import { error } from '../lines.js';

const THEMES = ['paper', 'terminal'];

export default {
    name: 'theme',
    summary: 'switch the site theme',
    usage: 'theme [paper|terminal]',
    complete: () => THEMES,
    run(args, ctx) {
        if (args.length === 0) return [`theme: ${ctx.getTheme()}`];
        const name = args[0].toLowerCase();
        if (!THEMES.includes(name)) {
            return [error(`theme: unknown theme '${args[0]}'. Try 'paper' or 'terminal'.`)];
        }
        ctx.setTheme(name);
        return [`theme set to ${name}`];
    },
};
