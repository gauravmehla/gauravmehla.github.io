# AGENTS.md — maintaining mehla.in

Instructions for AI agents (Claude Code and others) working on this repo.
Gaurav owns the site; the agent is its day-to-day maintainer.
Humans: start with [README.md](README.md) instead.

## Hard rules

1. **Nothing company-related on the site.** No employer names, products, internal
   systems, or details of work projects, in pages, posts, `_data/`, docs or commit
   messages. Describe work generically ("an internal admin platform").
   `make check` enforces this using the gitignored `.private-terms` list.
2. **Private projects get generic names** and a high-level description only.
   No links, no repo names. See [docs/content-guide.md](docs/content-guide.md).
3. **`master` is production.** GitHub Pages deploys every push to `master` to
   mehla.in. Work on a branch; only merge or push to `master` once Gaurav has
   said to ship.
4. **Run `make check` before every merge to `master`.** It must pass.
5. **Update [CHANGELOG.md](CHANGELOG.md)** in the same commit as any
   user-visible change.
6. **Keep it zero-JS-required.** Every page must read correctly with JavaScript
   off. JS is only for the theme toggle and the post table of contents.

## Where things live

| Want to change… | Edit |
| --- | --- |
| Bio text | `index.html` (top section) |
| Projects list | `_data/projects.yml` |
| Core stack line | `_data/stack.yml` |
| Footer / social links | `_data/social.yml` (+ icon in `_includes/icons/`) |
| Site title, tagline, SEO | `_config.yml` |
| A post | `_posts/YYYY-MM-DD-slug.md` |
| Styles | `_sass/_<area>.scss` (colours in `_tokens.scss`) |
| Page shells | `_layouts/default.html`, `_layouts/post.html` |

Full map and the reasoning behind it: [docs/architecture.md](docs/architecture.md).

## Workflow

1. `git fetch` and branch from `origin/master`. Don't trust the local `master`;
   it has been stale before.
2. Make the change, matching the existing style (4-space indent, plain class names,
   one Sass partial per page area, IIFE + `'use strict'` in JS).
3. `make serve` → check http://localhost:4000 in both themes and at phone width.
4. `make check`.
5. Add a CHANGELOG entry and commit with a conventional prefix
   (`feat:`, `fix:`, `content:`, `refactor:`, `docs:`, `chore:`).
6. Ask Gaurav before merging to `master`.

## Code standards

- **No build tooling beyond Jekyll.** No npm, bundlers or frameworks. GitHub
  Pages builds the site; only plugins on its
  [allowlist](https://pages.github.com/versions/) work.
- **Content in data files, markup in includes.** If something repeats, it
  belongs in `_data/` + a loop, or an `_includes/` partial.
- **Sass:** `@import` only (GitHub Pages' Sass compiler doesn't support `@use`).
  Breakpoints are `$bp-mobile` / `$bp-tablet` from `_tokens.scss`.
  No hard-coded colours outside `_tokens.scss`.
- **JS:** one file per feature in `assets/js/`, loaded with `defer`, and only on
  the pages that need it.

## Routine maintenance (each session)

Glance at these and tell Gaurav if something is stale:
- the newest post's date (the site is "about ideas", so long gaps show)
- `_data/projects.yml`: does "Now" still match what he works on?
- `CHANGELOG.md` `Unreleased`: anything waiting to ship?
