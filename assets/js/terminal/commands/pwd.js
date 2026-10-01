export default {
    name: 'pwd',
    summary: 'print the current folder',
    usage: 'pwd',
    run: (args, ctx) => [ctx.cwd.replace(/^~/, '/home/guest')],
};
