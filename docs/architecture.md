# Architecture

mehla.in is a static [Jekyll](https://jekyllrb.com/) site. GitHub Pages builds
it from the `master` branch on every push. There is no CI config and no
JavaScript build.

## How a page is built

```
_posts/*.md ─┐
_data/*.yml ─┼─▶ Liquid templates ─▶ _site/*.html ─▶ GitHub Pages ─▶ mehla.in
_config.yml ─┘   (_layouts, _includes)
_sass/*.scss ──▶ assets/css/main.scss ─▶ _site/assets/css/main.css
```

Every page is complete HTML at build time. Titles, meta tags and post content
don't depend on JavaScript.

## File map

```
_config.yml                 site title/tagline, permalinks, plugins, build excludes
_data/
  projects.yml              homepage projects list
  social.yml                footer links
  stack.yml                 "Core Stack" line under the bio
_includes/
  head.html                 <head>: meta (jekyll-seo-tag), fonts, CSS, theme bootstrap
  footer.html               dots + social icons (loops over _data/social.yml)
  project-item.html         one project row
  icons/*.svg               footer icons
_layouts/
  default.html              page shell: head, <main>, footer
  post.html                 post: breadcrumb, title, date, table of contents
_posts/                     one Markdown file per post
_sass/
  _tokens.scss              colours (CSS custom properties), fonts, breakpoints
  _base.scss                reset, typography, page width
  _home.scss                bio, theme button, writing list, projects
  _post.scss                post page typography
  _toc.scss                 table of contents (sidebar on desktop, drawer on mobile)
  _not-found.scss           404 page
  _footer.scss              footer
assets/
  css/main.scss             imports the partials above, in order
  js/theme.js               theme toggle button (every page)
  js/toc.js                 table of contents (post pages only)
index.html                  homepage
404.html                    not-found page (GitHub Pages serves it automatically)
scripts/check.sh            pre-publish checks (run by `make check`)
Makefile                    serve / build / check via Docker
```

## Themes

There are two themes: **paper** (light) and **terminal** (dark). Each one is a
set of CSS custom properties in `_sass/_tokens.scss`, selected by a class on
`<html>`.

- A small inline script in `_includes/head.html` picks the theme **before first
  paint**: a saved choice (`localStorage['gm-theme']`) wins, otherwise the OS
  dark-mode setting decides. Because it runs before paint, the page never
  flashes the wrong theme.
- `assets/js/theme.js` only wires up the toggle button.
- With JS off, `:root` falls back to the paper colours.

## URLs

| URL | Source |
| --- | --- |
| `/` | `index.html` |
| `/blog/<slug>` | `_posts/YYYY-MM-DD-<slug>.md` (permalink `/blog/:title`) |
| `/feed.xml` | jekyll-feed |
| `/sitemap.xml`, `/robots.txt` | jekyll-sitemap |
| anything else | `404.html`, served with a real 404 status |

## Decisions

Newest first. Record new ones here when they're made.

- **2026-09-30 — Jekyll instead of a client-side SPA.** The previous version
  rendered everything in the browser (a JS router, `marked.js` from a CDN, and
  GitHub's 404.html redirect trick). As a result, pages had empty `<title>`s,
  content was hidden until JS ran, and posts were served with an HTTP 404
  status, so nothing could be indexed. Jekyll runs natively on GitHub Pages, so
  we gained real pages without adding build tooling.
- **2026-09-30 — Permalink `/blog/:title` without a trailing slash.** It keeps
  the URLs from the SPA version working (`/blog/hello-world`).
- **2026-09-30 — `theme: null` in `_config.yml`.** Otherwise the `github-pages`
  gem applies the default "primer" theme and emits a stray
  `/assets/css/style.css`.
- **2026-09-30 — Sass `@import`, not `@use`.** GitHub Pages compiles Sass with
  libsass, which doesn't support `@use`.
- **2026-09-30 — Private terms list kept out of git.** `.private-terms` names
  the things that must never appear on the site, so committing it would publish
  them.
