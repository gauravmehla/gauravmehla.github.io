export default {
    name: 'history',
    summary: 'commands you typed this visit',
    usage: 'history',
    run: (args, ctx) => ctx.history.map((command, i) => `${String(i + 1).padStart(3)}  ${command}`),
};
