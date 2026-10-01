// The terminal's tiny pretend filesystem: home (~) with two folders.
// Paths are strings: '~', '~/posts' or '~/projects'. Pure, so it's
// unit-tested in Node.

export const HOME = '~';
export const DIRS = ['posts', 'projects'];

function segments(cwd) {
    return cwd === HOME ? [] : cwd.slice(2).split('/');
}

function walk(from, arg) {
    const parts = from.slice();
    for (const part of arg.split('/')) {
        if (part === '' || part === '.') continue;
        if (part === '~') parts.length = 0;
        else if (part === '..') parts.pop();
        else parts.push(part.toLowerCase());
    }
    if (parts.length === 0) return HOME;
    if (parts.length === 1 && DIRS.includes(parts[0])) return `${HOME}/${parts[0]}`;
    return null;
}

// Where `cd <arg>` from `cwd` ends up, or null if there's no such folder.
// Forgiving: a folder name that doesn't exist relative to cwd is also
// tried from home, so `cd projects` works from inside posts.
export function resolveDir(cwd, arg) {
    const target = String(arg || '').trim();
    if (target === '' || target === '/') return HOME;
    return walk(segments(cwd), target) || walk([], target);
}

// 'posts' / 'projects' for a folder, null for home.
export function dirName(cwd) {
    return cwd === HOME ? null : segments(cwd)[0];
}

// Folder names Tab should offer from cwd.
export function dirCompletions(cwd) {
    return cwd === HOME ? DIRS.slice() : ['..', ...DIRS];
}
