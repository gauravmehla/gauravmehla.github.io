import { link, DATA_ERROR } from '../lines.js';

const display = (url) => url.replace(/^mailto:/, '').replace(/^https?:\/\//, '');

export default {
    name: 'contact',
    summary: 'email and social links',
    usage: 'contact',
    run(args, ctx) {
        if (!ctx.data) return [DATA_ERROR];
        const width = Math.max(...ctx.data.links.map((l) => l.label.length)) + 2;
        return ctx.data.links.map((l) =>
            link(`${l.label.padEnd(width)}${display(l.url)}`, l.url, !l.url.startsWith('mailto:')));
    },
};
