# Content guide

What goes on the site, and how it should sound.

## What the site is

A personal space for ideas: essays on technology, software, and where things
are heading. It's deliberately **not a résumé**. Projects and the bio are
context for the writing, not the point.

**Tagline:** *Software, systems, and what comes next.*

## Voice

- **First person, plain and direct.** Write the way Gaurav would explain it to
  another engineer over coffee.
- **Concrete over abstract.** "Turns messy input into clean, validated records"
  beats "an AI-powered data solution".
- **Calm confidence.** No hype words (*revolutionary*, *cutting-edge*,
  *leverage*), no exclamation marks.
- **Short.** A project description is one or two sentences, and the bio stays
  at two paragraphs.

## What never goes on the site

- Employer names, products, clients, or internal system names, past or present.
- Anything learned at work that isn't public.
- Links to private repositories.
- How a personal project actually works: its domain, data, workflow or
  numbers. Posts share **the idea**, not the specifics. Say "one of my
  projects", not what it does.

Describe work in general terms instead. **Admin Platform**, described as "an
internal operations tool I own end to end", is the model to follow. When
unsure, leave it out and ask.

`make check` blocks any term listed in `.private-terms` (see
[maintenance.md](maintenance.md)).

## Adding a post

Create `_posts/YYYY-MM-DD-slug.md`:

```markdown
---
title: My New Idea
description: One sentence. Shown in search results and link previews.
---

Body in Markdown. Don't add a `# Title`; the layout prints it.
Use `## Section` headings: they become the table of contents.
```

The post goes live at `/blog/slug` and appears on the homepage and in the RSS
feed automatically.

## Adding or changing a project

Edit `_data/projects.yml`. The comment at the top lists the fields. Order in
the file is display order. Only one project should carry `badge: Now`.

## Changing the bio

Edit the two paragraphs at the top of `index.html`. Keep them to the role, the
city, and what Gaurav is working on now, in general terms.

## Adding a terminal command or easter egg

1. Create `assets/js/terminal/commands/<name>.js` exporting
   `{ name, summary, usage, run(args, ctx) }`. Add `hidden: true` for an
   easter egg; it then never shows up in `help` or Tab completion.
2. Add it to `assets/js/terminal/registry.js`.
3. Add a test in `tests/terminal/` and run `make test`.

Replies are site content, so the rules above apply. Keep them short and
kind.
