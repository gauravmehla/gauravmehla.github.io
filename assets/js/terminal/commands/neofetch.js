import { LOGO, LOGO_WIDTH } from '../art.js';

const GAP = '   ';

function info(ctx) {
    const data = ctx.data;
    const count = (list) => (data ? String(list(data).length) : '?');
    return [
        'guest@mehla.in',
        '--------------',
        'OS: mehla.in',
        'Host: GitHub Pages',
        'Kernel: Jekyll',
        'Shell: guest-sh',
        'Uptime: 10+ years shipping',
        `Theme: ${ctx.getTheme()}`,
        `Posts: ${count((d) => d.posts)}`,
        `Projects: ${count((d) => d.projects)}`,
        `Stack: ${data ? data.stack.join(', ') : '?'}`,
    ];
}

export default {
    name: 'neofetch',
    summary: 'system info, the way techies like it',
    usage: 'neofetch',
    run(args, ctx) {
        const lines = info(ctx);
        const widest = Math.max(...lines.map((l) => l.length));

        // Not enough room side by side: info goes under the logo
        if (LOGO_WIDTH + GAP.length + widest > ctx.columns) return [...LOGO, '', ...lines];

        return lines.map((line, i) => `${(LOGO[i] || '').padEnd(LOGO_WIDTH)}${GAP}${line}`);
    },
};
