// The shell: turns a typed line into a command run, and handles Tab
// completion. Pure: no DOM, so it's unit-tested in Node.
import { error } from './lines.js';

export function parse(line) {
    const parts = String(line).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { name: '', args: [] };
    return { name: parts[0].toLowerCase(), args: parts.slice(1) };
}

export function findCommand(registry, name) {
    return registry.find((c) => c.name === name || (c.aliases || []).includes(name));
}

export async function execute(registry, line, ctx) {
    const { name, args } = parse(line);
    if (!name) return [];

    const command = findCommand(registry, name);
    if (!command) {
        return [error(`command not found: ${name}. Type 'help' to see what's available.`)];
    }

    try {
        const output = await command.run(args, ctx);
        return Array.isArray(output) ? output : [];
    } catch (err) {
        console.error(err);
        return [error(`${name}: something went wrong.`)];
    }
}

function commonPrefix(words) {
    let prefix = words[0];
    for (const word of words) {
        while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
}

// Returns { line, options }: the input after completing it, and the
// candidates to list when more than one matches.
export function complete(registry, line, ctx) {
    const parts = String(line).replace(/^\s+/, '').split(/\s+/);
    const current = parts[parts.length - 1];

    let candidates;
    if (parts.length === 1) {
        candidates = registry.filter((c) => !c.hidden).map((c) => c.name);
    } else {
        const command = findCommand(registry, parts[0].toLowerCase());
        if (!command || command.hidden || !command.complete) return { line, options: [] };
        candidates = command.complete(parts.slice(1, -1), ctx) || [];
    }

    const matches = candidates.filter((c) => c.toLowerCase().startsWith(current.toLowerCase()));
    if (matches.length === 0) return { line, options: [] };

    const before = parts.slice(0, -1).join(' ');
    const lead = before ? before + ' ' : '';
    if (matches.length === 1) return { line: lead + matches[0] + ' ', options: [] };

    const shared = commonPrefix(matches);
    return { line: lead + (shared.length > current.length ? shared : current), options: matches };
}
