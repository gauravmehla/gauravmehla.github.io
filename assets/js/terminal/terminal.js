// The terminal panel: DOM, input, rendering, open/close and focus.
// Loaded on first use by assets/js/terminal-loader.js. Command logic lives
// in shell.js and commands/; this file only connects it to the page.
import registry from './registry.js';
import { execute, complete } from './shell.js';
import { STYLES, muted } from './lines.js';
import { articleToLines } from './post-text.js';
import { HOME } from './fs.js';

const DATA_URL = '/assets/terminal.json';
const THEME_KEY = 'gm-theme';
const CHIPS = ['help', 'ls posts', 'whoami', 'contact', 'exit'];
const TOUCH = '(pointer: coarse)';
const NARROW = '(max-width: 420px)';  // narrower than the banner art

// `mehla.in` in figlet's "small" font (33 columns)
const BANNER = [
    '            _    _        _',
    '  _ __  ___| |_ | |__ _  (_)_ _',
    " | '  \\/ -_) ' \\| / _` |_| | ' \\",
    ' |_|_|_\\___|_||_|_\\__,_(_)_|_||_|',
];

function el(tag, className, attrs = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    return node;
}

// The prompt for a folder: guest@mehla.in:~/posts$
const promptFor = (cwd) => `guest@mehla.in:${cwd}$`;

function buildPanel(isTouch) {
    const root = el('div', 'terminal-root');
    const backdrop = el('div', 'terminal-backdrop');
    const panel = el('section', 'terminal', {
        role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Terminal', tabindex: '-1',
    });
    const output = el('div', 'terminal-output', { 'aria-live': 'polite' });
    const form = el('form', 'terminal-form');
    const prompt = el('label', 'terminal-prompt', { for: 'terminal-input' });
    prompt.textContent = promptFor(HOME);
    const input = el('input', 'terminal-input', {
        id: 'terminal-input', type: 'text', autocomplete: 'off', autocapitalize: 'off',
        autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'send',
    });
    form.append(prompt, input);

    panel.append(output);
    if (isTouch) {
        const chips = el('div', 'terminal-chips');
        for (const command of CHIPS) {
            const chip = el('button', 'terminal-chip', { type: 'button', 'data-command': command });
            chip.textContent = command;
            chips.append(chip);
        }
        panel.append(chips);
    }
    panel.append(form);
    root.append(backdrop, panel);
    return { root, backdrop, panel, output, input, form, prompt };
}

// One line of output → one element. Text only: never innerHTML.
function renderLine(line) {
    const row = el('div', 'terminal-line');
    if (typeof line === 'string') {
        row.textContent = line || ' ';
        return row;
    }
    if (line.href) {
        const a = el('a', 'terminal-link', { href: line.href });
        if (line.newTab) {
            a.target = '_blank';
            a.rel = 'noopener';
        }
        a.textContent = line.text;
        row.append(a);
        return row;
    }
    if (STYLES.includes(line.style)) row.classList.add(`is-${line.style}`);
    row.textContent = line.text || ' ';
    return row;
}

export function createTerminal() {
    const isTouch = window.matchMedia(TOUCH).matches;
    const ui = buildPanel(isTouch);
    document.body.append(ui.root);

    let isOpen = false;
    let opener = null;
    let historyIndex = 0;

    function print(lines) {
        ui.output.append(...lines.map(renderLine));
        ui.output.scrollTop = ui.output.scrollHeight;
    }

    function clear() {
        ui.output.replaceChildren();
    }

    function navigate(url, { newTab = false } = {}) {
        if (newTab) window.open(url, '_blank', 'noopener');
        else window.location.assign(url);
    }

    function getTheme() {
        return document.documentElement.className === 'theme-terminal' ? 'terminal' : 'paper';
    }

    // Same effect as the theme toggle button (assets/js/theme.js)
    function setTheme(name) {
        document.documentElement.className = 'theme-' + name;
        localStorage.setItem(THEME_KEY, name);
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: name } }));
    }

    function setCwd(dir) {
        ctx.cwd = dir;
        ui.prompt.textContent = promptFor(dir);
    }

    async function fetchPost(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const article = doc.getElementById('post-content');
        if (!article) throw new Error(`no #post-content in ${url}`);
        return articleToLines(article);
    }

    function setBackgroundInert(inert) {
        for (const node of document.body.children) {
            if (node !== ui.root) node.inert = inert;
        }
        document.body.classList.toggle('terminal-lock', inert);
    }

    function open(from) {
        if (isOpen) return;
        isOpen = true;
        opener = from || document.activeElement;
        setBackgroundInert(true);
        ui.root.classList.add('is-open');
        // On touch screens, focusing the input would pop the keyboard over the chips
        (isTouch ? ui.panel : ui.input).focus();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        ui.root.classList.remove('is-open');
        setBackgroundInert(false);
        if (opener && document.contains(opener)) opener.focus();
    }

    function toggle(from) {
        if (isOpen) close();
        else open(from);
    }

    const ctx = {
        registry, data: null, history: [], cwd: HOME,
        clear, close, navigate, getTheme, setTheme, setCwd, fetchPost,
    };

    const ready = fetch(DATA_URL)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
        .then((data) => {
            ctx.data = data;
        });

    ready.then(() => {
        const art = window.matchMedia(NARROW).matches ? ['mehla.in'] : BANNER;
        const tagline = ctx.data ? ctx.data.site.tagline + '.' : '';
        print([...art, '', tagline, muted("Type 'help' to see what you can do."), '']);
    });

    async function run(line) {
        print([{ text: `${promptFor(ctx.cwd)} ${line}`, style: 'echo' }]);
        if (line.trim()) ctx.history.push(line.trim());
        historyIndex = ctx.history.length;
        await ready;
        print(await execute(registry, line, ctx));
    }

    ui.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const line = ui.input.value;
        ui.input.value = '';
        run(line);
    });

    ui.input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const result = complete(registry, ui.input.value, ctx);
            if (result.options.length > 0) {
                print([{ text: `${promptFor(ctx.cwd)} ${ui.input.value}`, style: 'echo' }, result.options.join('  ')]);
            }
            ui.input.value = result.line;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) ui.input.value = ctx.history[--historyIndex];
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < ctx.history.length) ui.input.value = ctx.history[++historyIndex] || '';
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            clear();
        } else if (e.key === '`' && ui.input.value === '') {
            e.preventDefault();
            close();
        }
    });

    ui.root.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    });

    ui.backdrop.addEventListener('click', close);

    ui.panel.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-command]');
        if (chip) {
            run(chip.dataset.command);
            return;
        }
        // Clicking empty space puts the cursor back in the input (desktop only)
        if (!isTouch && !e.target.closest('a') && window.getSelection().isCollapsed) ui.input.focus();
    });

    return { open, close, toggle };
}
