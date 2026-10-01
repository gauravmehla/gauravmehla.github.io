import { heading, muted, error } from '../lines.js';
import { findCommand } from '../shell.js';

const visible = (registry) => registry.filter((c) => !c.hidden);

export default {
    name: 'help',
    summary: 'list commands, or explain one',
    usage: 'help [command]',
    complete: (args, ctx) => visible(ctx.registry).map((c) => c.name),
    run(args, ctx) {
        if (args.length > 0) {
            const command = findCommand(ctx.registry, args[0].toLowerCase());
            if (!command || command.hidden) return [error(`help: no such command: ${args[0]}`)];
            return [heading(command.usage), command.summary];
        }

        const commands = visible(ctx.registry);
        const width = Math.max(...commands.map((c) => c.usage.length)) + 2;
        return [
            heading('Commands'),
            ...commands.map((c) => `  ${c.usage.padEnd(width)}${c.summary}`),
            '',
            muted('Tab completes · ↑ ↓ history · Esc closes'),
        ];
    },
};
