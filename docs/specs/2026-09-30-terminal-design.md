# Terminal: design spec

**Status:** approved and implemented · **Date:** 2026-09-30 · **Branch:** `terminal`

A drop-down terminal that lets curious, technical visitors explore mehla.in by
typing commands. It's an optional extra on top of the site, not a replacement
for it.

---

## 1. Goals

**For whom:** developers and other techies who visit the site.

**What success looks like:** a visitor presses `` ` `` or clicks `>_`, types
`help`, reads a post without leaving the terminal, stumbles on a hidden
command, and smiles (or shares it).

**Constraints**

- The site works exactly as it does today without the terminal. It's
  progressive enhancement: nothing about reading the site depends on it.
- No external libraries and no build step beyond Jekyll.
- Normal visitors pay almost nothing. The always-loaded part is under 1 KB;
  everything else loads the first time the terminal opens.
- Content comes from the same sources as the site (`_posts/`, `_data/`), so
  the terminal can't drift out of date or show anything the site doesn't.
- Every command lives in its own file, so future easter eggs and games are
  one-file additions.

**Not in v1:** games, a fake filesystem with `cd`, persistent history across
visits, a terminal icon on post pages (the shortcut still works there).

---

## 2. Experience

### Opening and closing

| Action | Result |
| --- | --- |
| Press `` ` `` anywhere on the site | Terminal slides down from the top |
| Click the `>_` icon (landing page, next to the theme toggle) | Same |
| Press `Esc`, type `exit`, or press `` ` `` while the input is empty | Terminal closes; focus returns to where it was |
| Click the dimmed page below the terminal | Closes |

The shortcut is ignored while the visitor is typing in a form field, or when
Ctrl, Cmd or Alt is held.

### Layout

- A panel that drops down from the top: 60% of the viewport height on desktop
  and 85% on phones (to leave room above the on-screen keyboard). The page
  stays visible and dimmed underneath.
- Output scrolls; the input line stays pinned at the bottom.
- Monospace (Geist Mono), using the active theme's colours: paper or terminal.
- It slides in over about 200 ms. Visitors who have turned off motion in
  their system settings get no slide; it simply appears.

### First open

```
[ASCII wordmark: "mehla.in"]
Software, systems, and what comes next.
Type 'help' to see what you can do.

guest@mehla.in:~$ █
```

- The wordmark is `mehla.in` rendered in figlet's "small" font, no wider than
  40 columns, and stored as a constant in `terminal.js`.
- The tagline comes from `_config.yml` (via `terminal.json`), so it matches
  the site.
- On screens narrower than the wordmark, it's replaced by a single line,
  `mehla.in`, so it never wraps.

### Typing aids

- **Tab** completes command names, post slugs and `open` targets. If more
  than one match is possible, it lists them.
- **↑ / ↓** move through the commands typed in this visit.
- **Ctrl+L** clears the screen, the same as `clear`.

### Phones

On touch devices (`pointer: coarse`), a row of tap chips sits above the
input: `help` · `ls posts` · `whoami` · `contact` · `exit`. Tapping a chip runs the
command; the echoed `guest@mehla.in:~$ <command>` line shows what ran, so
visitors still learn it without the keyboard popping up.

### Accessibility

- The panel is a `role="dialog"` with `aria-modal="true"` and the label
  "Terminal".
- Focus moves to the input on open (on touch devices, to the panel instead,
  so the keyboard doesn't cover the chips), stays inside the panel while
  it's open, and returns to the opener on close.
- The output region is `aria-live="polite"`, so screen readers announce
  results.
- The `>_` icon is a real `<button>` with the accessible name "Open terminal"
  and the tooltip "Open terminal ( ` )".

---

## 3. Commands

### Listed in `help`

| Command | Behaviour |
| --- | --- |
| `help` | Lists the commands below, with one-line descriptions. `help <cmd>` shows usage. |
| `ls` | Prints `posts/  projects/`. |
| `ls posts` | Numbered list, newest first: `1  2026-09-30  My Agents Never Said "I Don't Know"`. |
| `ls projects` | Each project: name, tech, one-line description. |
| `cat <post>` | Prints the post as readable text: title, date, headings, paragraphs and lists. Long posts scroll. Ends with `→ open <slug> to read it on the page`. |
| `open <target>` | Post: navigates to it. `github`, `linkedin`, `twitter`, `email`, `rss`: opens that link (external links in a new tab). `home`: goes to `/`. |
| `whoami` | The bio, as plain text. |
| `contact` | Email and social links, each clickable. |
| `theme [paper\|terminal]` | Switches the site theme, the same as the toggle button. With no argument, prints the current theme. |
| `history` | Commands typed this visit, numbered. |
| `clear` | Clears the screen. |
| `exit` | Closes the terminal. |

**Naming a post.** Every place that takes a post accepts its number from
`ls posts` (`cat 1`), its full slug, or any unique beginning of the slug
(`cat my-agents`). If a prefix matches more than one post, the matches are
listed instead.

### Hidden (easter eggs, v1)

Not listed in `help`, and Tab won't complete them.

| Command | Reply |
| --- | --- |
| `ask <anything>` | `I don't know.` An agent that finally says it; a nod to the post. |
| `sudo <anything>` | `Nice try. This incident will be reported.` |
| `rm -rf /` (and `rm` with any arguments) | `rm: permission denied. Nice try, though.` |

### Errors

| Situation | Output |
| --- | --- |
| Unknown command | `command not found: foo. Type 'help' to see what's available.` |
| Unknown post | `cat: foo: no such post. Try 'ls posts'.` |
| Post page fails to load | `cat: couldn't load that post. Try 'open <slug>' instead.` |
| Site data fails to load | The terminal still opens. Commands that need data print `couldn't load site data. Try refreshing the page.` |
| A command throws | `<cmd>: something went wrong.` The error is logged to the browser console. |

---

## 4. Architecture

### Files

```
assets/js/terminal-loader.js     every page, tiny: shortcut + icon → load terminal on first use
assets/js/terminal/
  terminal.js                    UI: panel DOM, input, history, rendering, focus, open/close
  shell.js                       pure logic: parse a line, resolve the command, run it, Tab completion
  resolve.js                     pure: find a post from a number, slug or prefix
  post-text.js                   turn a fetched post page into lines of text
  registry.js                    the list of commands (the only file to edit when adding one)
  commands/
    help.js  ls.js  cat.js  open.js  whoami.js  contact.js
    theme.js  history.js  clear.js  exit.js
    eggs.js                      ask, sudo, rm
assets/terminal.json             generated by Jekyll: posts, projects, links, bio
_sass/_terminal.scss             panel, chips and icon styles (part of main.css)
_data/profile.yml                bio as data (see "Single source for the bio" below)
tests/terminal/*.test.mjs        unit tests for the pure modules
```

### The command contract

Every command file exports one object:

```js
export default {
    name: 'cat',
    summary: 'read a post',          // shown in `help`
    usage: 'cat <post>',             // shown in `help cat`
    hidden: false,                   // true = easter egg: not in help, not completed
    complete(args, ctx) { ... },     // optional: returns completion candidates
    run(args, ctx) { ... },          // returns output lines (or a Promise of them)
};
```

`ctx` is the only thing a command can use to affect anything else:

| `ctx` member | What it does |
| --- | --- |
| `ctx.data` | The parsed `terminal.json` (or `null` if it failed to load) |
| `ctx.registry` | All commands (used by `help` and completion) |
| `ctx.history` | This visit's commands |
| `ctx.clear()` | Clears the screen |
| `ctx.close()` | Closes the terminal |
| `ctx.navigate(url, { newTab })` | Goes to a page or link |
| `ctx.getTheme()` | The current theme name |
| `ctx.setTheme(name)` | Applies a theme the same way the toggle does |
| `ctx.fetchPost(url)` | Fetches a post page and returns its lines |

**Output is data, not HTML.** A command returns an array of lines. Each line
is a string, or `{ text, href }` for a link, or `{ text, style }` where
`style` is one of a fixed set (`heading`, `muted`, `error`). The renderer
creates text nodes only and never uses `innerHTML`, so nothing in a post or
in data can inject markup.

`commands/eggs.js` exports an array of hidden commands, which `registry.js`
spreads in.

Adding a game later means one new file in `commands/` plus one line in
`registry.js`. A game that needs the whole panel can be given a
`ctx.takeOver()` hook when we build it; it isn't needed for v1.

### Data flow

```
Jekyll build ──▶ /assets/terminal.json  (from _posts, _data/projects, _data/social, _data/profile)
                         │
` or >_ ──▶ terminal-loader.js ──import()──▶ terminal.js ──fetch──▶ terminal.json
                                                  │
                     line typed ──▶ shell.js ──▶ commands/*.js ──▶ lines ──▶ renderer
                                                  │
                     cat <post> ──fetch(post.url)──▶ post-text.js ──▶ lines
```

`terminal.json` (generated, a few KB):

```json
{
  "site":     { "title": "...", "tagline": "...", "url": "https://mehla.in" },
  "bio":      ["paragraph", "paragraph"],
  "posts":    [{ "slug": "...", "title": "...", "date": "2026-09-30", "description": "...", "url": "/blog/..." }],
  "projects": [{ "name": "...", "tech": "...", "description": "...", "url": null }],
  "links":    [{ "key": "github", "label": "GitHub", "url": "https://github.com/gauravmehla" }]
}
```

`cat` fetches the real post page and reads its `#post-content` element, so
the terminal always shows exactly what the site shows. Nothing is duplicated
in `terminal.json`.

### Changes to existing code

- **Theme.** `assets/js/theme.js` gains a listener for a `themechange` event,
  so its button icon stays right when the terminal changes the theme. The
  terminal's `setTheme` writes the same `gm-theme` key and `<html>` class as
  the toggle does.
- **Single source for the bio.** The bio paragraphs move from `index.html`
  into `_data/profile.yml`. The homepage, `terminal.json` and (after the
  `llms-txt` branch merges) `llms.txt` all read from it, so one edit updates
  all three.
- **Landing page.** A `>_` button joins the theme toggle in `.bio-top-row`.
- **Default layout.** Loads `terminal-loader.js` with `defer` on every page.

---

## 5. Privacy

- The terminal shows only what's already in `_posts/` and `_data/`. The
  privacy rules in `docs/content-guide.md` apply to it automatically.
- `terminal.json` is part of the built site, so `make check` already scans
  it for private terms.
- Easter-egg text is site content and follows the same rules.

---

## 6. Testing

- **Unit tests** for the pure modules: `shell.js` (parsing, dispatch,
  unknown commands, completion), `resolve.js` (number, slug, prefix,
  ambiguity) and the command `run()` functions, using a fake `ctx`. They use
  Node's built-in test runner, in Docker like the rest of the tooling, via a
  new `make test`. `make check` runs them too.
- **Build check:** `make check` also requires `assets/terminal.json`, and
  checks that it parses as JSON.
- **In the browser** (done by me before every ship, at desktop and phone
  width, in both themes): open and close by key, by icon and by Esc; every
  command; Tab and history; tap chips on mobile; focus returns to the opener;
  no console errors; the site still works with the terminal never opened.

---

## 7. Docs to update

- `docs/architecture.md`: the terminal in the file map, plus a decision entry.
- `docs/content-guide.md`: how to add a command or an easter egg.
- `AGENTS.md`: a "Where things live" row for terminal commands.
- `CHANGELOG.md`: an entry under Unreleased.

---

## 8. Decisions made while designing

| Question | Decision | Why |
| --- | --- | --- |
| How it appears | Drop-down console | The page stays visible, it's quick to close, and it feels like a secret built into the site |
| Shortcut | `` ` `` (backtick) | The classic console key; it doesn't clash with browser shortcuts |
| Phones | Terminal plus tap chips | Fun with one thumb, and visitors still discover it |
| Implementation | Plain JS, loaded only when opened | No dependencies, and almost no cost to visitors who never open it |
| Reading posts | Fetch the real page and convert it to text | One source of truth, and `terminal.json` stays small |
