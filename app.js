(function () {
    'use strict';

    // ===========================
    // Theme Toggle
    // ===========================

    const THEME_KEY = 'gm-theme';

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.body.className = 'theme-' + theme;
        const radio = document.getElementById('theme-' + theme);
        if (radio) radio.checked = true;
        localStorage.setItem(THEME_KEY, theme);
    }

    function initTheme() {
        applyTheme(getPreferredTheme());

        document.querySelectorAll('.theme-toggle input[type="radio"]').forEach(function (radio) {
            radio.addEventListener('change', function () {
                applyTheme(this.value);
            });
        });
    }

    // ===========================
    // Router
    // ===========================

    const homeView = document.getElementById('home-view');
    const postView = document.getElementById('post-view');
    const notFoundView = document.getElementById('not-found-view');
    const postContent = document.getElementById('post-content');
    const postsList = document.getElementById('posts-list');
    const noPostsMsg = document.getElementById('no-posts-msg');

    let postsData = [];

    function showView(view) {
        homeView.style.display = 'none';
        postView.style.display = 'none';
        notFoundView.style.display = 'none';
        view.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function show404() {
        document.title = 'Page Not Found — Gaurav Mehla';
        showView(notFoundView);
    }

    async function showPost(slug) {
        try {
            const res = await fetch('/content/blog/' + slug + '.md');
            if (!res.ok) {
                show404();
                return;
            }

            const md = await res.text();
            const html = marked.parse(md);

            // Find post metadata
            const post = postsData.find(function (p) { return p.slug === slug; });
            const title = post ? post.title : slug;
            const date = post ? post.date : '';

            let metaHtml = '<h1>' + title + '</h1>';
            if (date) {
                metaHtml += '<p class="post-meta">' + formatDate(date) + '</p>';
            }

            postContent.innerHTML = metaHtml + html;
            document.title = title + ' — Gaurav Mehla';
            showView(postView);
        } catch (e) {
            show404();
        }
    }

    function showHome() {
        document.title = 'Gaurav Mehla';
        showView(homeView);
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function navigate() {
        let path = window.location.pathname;

        // Handle GitHub Pages 404.html redirect
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('p');
        if (redirectPath) {
            path = decodeURIComponent(redirectPath);
            window.history.replaceState(null, '', path);
        }

        // Route matching
        if (path === '/' || path === '/index.html') {
            showHome();
        } else {
            const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)\/?$/);
            if (blogMatch) {
                showPost(blogMatch[1]);
            } else {
                show404();
            }
        }
    }

    // ===========================
    // Posts List
    // ===========================

    async function loadPosts() {
        try {
            const res = await fetch('/posts.json');
            if (!res.ok) return;
            postsData = await res.json();

            if (postsData.length === 0) {
                noPostsMsg.style.display = 'block';
                return;
            }

            noPostsMsg.style.display = 'none';

            postsData.forEach(function (post) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '/blog/' + post.slug;
                a.textContent = post.title;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    window.history.pushState(null, '', '/blog/' + post.slug);
                    navigate();
                });
                li.appendChild(a);

                if (post.date) {
                    const span = document.createElement('span');
                    span.className = 'post-date';
                    span.textContent = formatDate(post.date);
                    li.appendChild(span);
                }

                postsList.appendChild(li);
            });
        } catch (e) {
            // silently fail — show the "coming soon" message
        }
    }

    // ===========================
    // Internal link handling
    // ===========================

    function initLinks() {
        // Home link
        document.getElementById('home-link').addEventListener('click', function (e) {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            navigate();
        });

        // Back link
        document.getElementById('back-link').addEventListener('click', function (e) {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            navigate();
        });

        // Go home button (404 page)
        document.getElementById('go-home-btn').addEventListener('click', function (e) {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            navigate();
        });

        // popstate for browser back/forward
        window.addEventListener('popstate', navigate);
    }

    // ===========================
    // Init
    // ===========================

    async function init() {
        initTheme();
        initLinks();
        await loadPosts();
        navigate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
