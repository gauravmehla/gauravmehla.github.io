# Gaurav Mehla — Portfolio & Writings

This is the source code for my personal website, [mehla.in](https://mehla.in). 

It is designed to be a clean, minimal, and typography-focused space for essays and ideas, moving away from a traditional résumé-style portfolio.

## Tech Stack
The site is built as a **zero-build Single Page Application (SPA)** using only vanilla web technologies. There is no Node.js, no bundlers (Webpack/Vite), and no frameworks (React/Vue). 

* **HTML/CSS:** Semantic HTML5 and plain CSS with CSS variables for the light/dark design system.
* **JavaScript:** Vanilla ES6+ for client-side routing and theme toggling.
* **Markdown rendering:** [`marked.js`](https://marked.js.org/) (loaded via CDN) is used to parse blog posts from Markdown into HTML on the fly.
* **Typography:** [Noto Serif](https://fonts.google.com/noto/use#use-noto-fonts-as-web-fonts) from Google Fonts.

## Architecture & Routing
The site uses client-side routing via the HTML5 History API (`pushState`).
Because it is hosted on **GitHub Pages**, which does not natively support SPA routing (where all unknown routes fallback to `index.html`), we use the "404.html redirect trick":
1. When a user navigates directly to a path like `/blog/hello-world`, GitHub Pages serves `404.html`.
2. The custom `404.html` immediately redirects back to `index.html` via a query parameter: `/?p=/blog/hello-world`.
3. The `app.js` router reads the query parameter, updates the URL using `replaceState()`, and renders the correct view.

## How to add a new post
1. Write a new Markdown file (e.g., `my-new-idea.md`) and place it in the `content/blog/` directory.
2. Add an entry to the `posts.json` manifest file:
   ```json
   {
       "slug": "my-new-idea",
       "title": "My New Idea",
       "date": "2026-03-10",
       "description": "A short summary of the post."
   }
   ```
3. Commit and push to the `master` branch. The site will automatically update.

## Local Development
Because the app relies on fetching local `.md` and `.json` files via AJAX, it must be run through a local web server (opening `index.html` directly in the browser via `file://` will cause CORS errors).

A custom Python SPA server is included to mimic the GitHub Pages routing behavior locally:

```bash
# Start the SPA server on port 3000
python3 serve.py 3000
```
Then visit `http://localhost:3000` in your browser.
