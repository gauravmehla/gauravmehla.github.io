# mehla.in

Source for my personal site, [mehla.in](https://mehla.in): a quiet,
typography-first space for essays on technology, software, and what comes next.

It's a plain [Jekyll](https://jekyllrb.com/) site. GitHub Pages builds and
deploys it on every push to `master`.

## Common tasks

| I want to… | Do this |
| --- | --- |
| Write a post | Add `_posts/YYYY-MM-DD-slug.md` with `title` and `description` front matter |
| Change projects | Edit `_data/projects.yml` |
| Change the bio | Edit the top of `index.html` |
| Preview locally | `make serve`, then open http://localhost:4000 (needs Docker) |
| Check before shipping | `make check` |

## Docs

- [docs/content-guide.md](docs/content-guide.md): voice, what never goes on the site, how to add things
- [docs/architecture.md](docs/architecture.md): how it's built, file map, decisions
- [docs/maintenance.md](docs/maintenance.md): commands, shipping, hosting, gotchas
- [CHANGELOG.md](CHANGELOG.md): what changed and when
- [AGENTS.md](AGENTS.md): rules for AI agents maintaining the site

## Stack

Jekyll + Liquid templates, Sass partials, and two small vanilla JS files (the
theme toggle and the post table of contents). Fonts are Lora and Geist Mono.
Plugins: jekyll-seo-tag, jekyll-feed, jekyll-sitemap.
