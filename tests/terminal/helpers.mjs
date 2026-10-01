// Shared test fixtures for the terminal modules.

export const DATA = {
    site: { title: 'Gaurav Mehla', tagline: 'Software, systems, and what comes next', url: 'https://mehla.in' },
    bio: ['First paragraph.', 'Second paragraph.'],
    posts: [
        {
            slug: 'my-agents-never-said-i-dont-know',
            title: 'My Agents Never Said "I Don\'t Know"',
            date: '2026-09-30',
            description: 'About agents.',
            url: '/blog/my-agents-never-said-i-dont-know',
        },
        { slug: 'hello-world', title: 'Hello World', date: '2026-03-09', description: 'First post.', url: '/blog/hello-world' },
    ],
    projects: [
        { name: 'Admin Platform', tech: 'Go / Kubernetes', description: 'An internal platform.', url: null },
        { name: 'The JavaScript Workshop', tech: 'Packt Publishing', description: 'A book.', url: 'https://example.com/book' },
    ],
    links: [
        { key: 'email', label: 'Email', url: 'mailto:gaurav@mehla.in' },
        { key: 'github', label: 'GitHub', url: 'https://github.com/gauravmehla' },
    ],
};

// A ctx like the one terminal.js builds, recording side effects in ctx.calls.
export function fakeCtx(overrides = {}) {
    const calls = { navigate: [], setTheme: [], fetchPost: [], setCwd: [], clear: 0, close: 0 };
    const ctx = {
        registry: [],
        data: structuredClone(DATA),
        history: [],
        theme: 'paper',
        cwd: '~',
        clear() { calls.clear++; },
        close() { calls.close++; },
        navigate(url, opts = {}) { calls.navigate.push({ url, newTab: !!opts.newTab }); },
        getTheme() { return ctx.theme; },
        setTheme(name) { calls.setTheme.push(name); ctx.theme = name; },
        setCwd(dir) { calls.setCwd.push(dir); ctx.cwd = dir; },
        async fetchPost(url) { calls.fetchPost.push(url); return ['Body paragraph.']; },
        calls,
        ...overrides,
    };
    return ctx;
}

// Lines → their visible text, for assertions that don't care about styling.
export const texts = (lines) => lines.map((l) => (typeof l === 'string' ? l : l.text));
