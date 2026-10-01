// Easter eggs: they run when typed, but `help` and Tab never reveal them.
// This file exports an array; registry.js spreads it in.
// New eggs follow docs/content-guide.md like any other site text.
export default [
    {
        name: 'ask',
        summary: 'ask me anything',
        usage: 'ask <question>',
        hidden: true,
        run: () => ["I don't know."],
    },
    {
        name: 'sudo',
        summary: 'run as superuser',
        usage: 'sudo <command>',
        hidden: true,
        run: () => ['Nice try. This incident will be reported.'],
    },
    {
        name: 'rm',
        summary: 'remove files',
        usage: 'rm <path>',
        hidden: true,
        run: () => ['rm: permission denied. Nice try, though.'],
    },
];
