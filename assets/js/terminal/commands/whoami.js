import { DATA_ERROR } from '../lines.js';

export default {
    name: 'whoami',
    summary: 'about me',
    usage: 'whoami',
    run(args, ctx) {
        if (!ctx.data) return [DATA_ERROR];
        return ctx.data.bio.flatMap((paragraph, i) => (i === 0 ? [paragraph] : ['', paragraph]));
    },
};
