(function () {
    'use strict';

    // ===========================
    // Theme Toggle
    // ===========================

    const THEME_KEY = 'gm-theme';

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'terminal' : 'paper';
    }

    function applyTheme(theme) {
        document.body.className = 'theme-' + theme;
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = theme === 'paper' ? '☾' : '☀';
        localStorage.setItem(THEME_KEY, theme);
    }

    function initTheme() {
        applyTheme(getPreferredTheme());

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                const current = localStorage.getItem(THEME_KEY) || 'paper';
                applyTheme(current === 'paper' ? 'terminal' : 'paper');
            });
        }
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
    const postDateBc = document.getElementById('post-date-bc');

    let postsData = [];
    let postsLoaded = false;

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

    function findPost(slug) {
        return postsData.find(function (p) { return p.slug === slug; });
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatDateShort(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function getYear(dateStr) {
        return dateStr ? dateStr.substring(0, 4) : '';
    }

    async function showPost(slug) {
        // Set title immediately from posts metadata (no async wait)
        var post = findPost(slug);
        var title = post ? post.title : slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        document.title = title + ' — Gaurav Mehla';

        try {
            const res = await fetch('/content/blog/' + slug + '.md');
            if (!res.ok) {
                show404();
                return;
            }

            const md = await res.text();
            const html = marked.parse(md);

            // Re-check post metadata (may have loaded by now)
            if (!post && postsLoaded) {
                post = findPost(slug);
                if (post) {
                    title = post.title;
                    document.title = title + ' — Gaurav Mehla';
                }
            }

            const date = post ? post.date : '';

            // Update breadcrumb date
            if (postDateBc) {
                postDateBc.textContent = date ? formatDateShort(date) : '';
            }

            let metaHtml = '<h1>' + title + '</h1>';
            if (date) {
                metaHtml += '<p class="post-meta">' + formatDate(date) + '</p>';
            }

            postContent.innerHTML = metaHtml + html;
            buildToc();
            showView(postView);
        } catch (e) {
            show404();
        }
    }

    function showHome() {
        document.title = 'Gaurav Mehla';
        clearToc();
        showView(homeView);
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
            postsLoaded = true;

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
                    span.className = 'post-year';
                    span.textContent = getYear(post.date);
                    li.appendChild(span);
                }

                postsList.appendChild(li);
            });
        } catch (e) {
            // silently fail — show the "coming soon" message
        }
    }

    // ===========================
    // Table of Contents
    // ===========================

    const tocSidebar = document.getElementById('toc-sidebar');
    const tocOverlay = document.getElementById('toc-overlay');
    const tocToggle = document.getElementById('toc-toggle');
    const tocClose = document.getElementById('toc-close');
    const tocList = document.getElementById('toc-list');
    let scrollHandler = null;

    function isMobile() {
        return window.innerWidth <= 900;
    }

    function openToc() {
        tocSidebar.classList.add('is-open');
        tocOverlay.classList.add('is-visible');
    }

    function closeToc() {
        tocSidebar.classList.remove('is-open');
        tocOverlay.classList.remove('is-visible');
    }

    function buildToc() {
        tocList.innerHTML = '';
        const headings = postContent.querySelectorAll('h2');

        if (headings.length === 0) {
            tocSidebar.classList.remove('has-headings');
            tocToggle.classList.remove('has-headings');
            return;
        }

        tocSidebar.classList.add('has-headings');
        tocToggle.classList.add('has-headings');

        headings.forEach(function (h, i) {
            // Assign an id to the heading for anchor links
            var id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            h.id = id;

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = h.textContent;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                if (isMobile()) {
                    closeToc();
                    setTimeout(function () {
                        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                }
            });
            li.appendChild(a);
            tocList.appendChild(li);
        });

        // Scroll spy — highlight active section
        if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
        scrollHandler = function () {
            var currentId = '';
            headings.forEach(function (h) {
                var rect = h.getBoundingClientRect();
                if (rect.top <= 120) {
                    currentId = h.id;
                }
            });
            tocList.querySelectorAll('a').forEach(function (a) {
                a.classList.toggle('toc-active', a.getAttribute('href') === '#' + currentId);
            });
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    function clearToc() {
        tocList.innerHTML = '';
        tocSidebar.classList.remove('has-headings');
        tocToggle.classList.remove('has-headings');
        closeToc();
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }
    }

    tocToggle.addEventListener('click', openToc);
    tocClose.addEventListener('click', closeToc);
    tocOverlay.addEventListener('click', closeToc);

    // ===========================
    // Internal link handling
    // ===========================

    function initLinks() {
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
