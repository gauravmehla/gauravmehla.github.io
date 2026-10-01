export default {
    name: 'exit',
    summary: 'close the terminal (Esc)',
    usage: 'exit',
    run(args, ctx) {
        ctx.close();
        return [];
    },
};
