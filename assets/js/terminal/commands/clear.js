export default {
    name: 'clear',
    summary: 'clear the screen (Ctrl+L)',
    usage: 'clear',
    run(args, ctx) {
        ctx.clear();
        return [];
    },
};
