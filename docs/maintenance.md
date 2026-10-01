# Maintenance

## Commands

Everything runs in Docker, so you only need Docker Desktop.

| Command | What it does |
| --- | --- |
| `make serve` | Preview at http://localhost:4000. Rebuilds when you save. |
| `make build` | Build the site into `_site/`. |
| `make check` | Build, then run the pre-publish checks. |
| `make clean` | Delete `_site/` and caches. |

The first run downloads the Ruby image and gems (about a minute). Later runs
are quick.

## Shipping a change

1. Work on a branch created from `origin/master`.
2. `make check` must pass.
3. Add a line to `CHANGELOG.md`.
4. Merge into `master` (PR or direct push). GitHub Pages rebuilds and the site
   is live in about a minute.
5. Spot-check https://mehla.in.

If a deploy breaks, revert the commit on `master` and push again. The site
returns to the previous version on the next build.

## `.private-terms`

A gitignored file at the repo root, with one word or name per line (`#` starts a
comment). `make check` fails if any of them appear anywhere in the built site.
Put employer, product and client names here.

The file isn't in git, so each new machine needs it recreated. If it's missing,
`make check` fails and tells you.

## Hosting facts

- GitHub Pages, "legacy" build, source **`master` / root**. The `gh-pages`
  branch is unused.
- Custom domain `mehla.in` comes from the `CNAME` file; HTTPS is enforced and
  the certificate renews automatically.
- Branches `v1`, `v2`, `v3` hold earlier versions of the site, kept for
  history.

## Gotchas

- **Local `master` can be stale.** It has been 14 commits behind
  `origin/master` before. Always branch from `origin/master`.
- **macOS system Ruby is too old** for the `github-pages` gem. That's why the
  Makefile uses Docker.
- **Plugins:** only the ones on GitHub Pages'
  [allowlist](https://pages.github.com/versions/) run in production, even if
  they work locally.
