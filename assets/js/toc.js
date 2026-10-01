// Post table of contents: builds the list from the article's h2s,
// highlights the section in view, and runs the mobile drawer.
// Loaded only by _layouts/post.html.
(function () {
    'use strict';

    const MOBILE_MAX_WIDTH = 900;  // keep in sync with $bp-tablet in _sass/_tokens.scss
    const ACTIVE_OFFSET_PX = 120;  // a heading counts as "current" once it's this close to the top

    const article = document.getElementById('post-content');
    const sidebar = document.getElementById('toc-sidebar');
    const overlay = document.getElementById('toc-overlay');
    const toggle = document.getElementById('toc-toggle');
    const closeBtn = document.getElementById('toc-close');
    const list = document.getElementById('toc-list');
    if (!article || !list) return;

    const headings = article.querySelectorAll('h2');
    if (headings.length === 0) return;

    function isMobile() {
        return window.innerWidth <= MOBILE_MAX_WIDTH;
    }

    function open() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
    }

    function close() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
    }

    function scrollToHeading(id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }

    function buildList() {
        headings.forEach(function (h) {
            // kramdown assigns ids at build time; slug fallback just in case
            if (!h.id) {
                h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            }
            const id = h.id;

            const a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = h.textContent;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                if (isMobile()) {
                    close();
                    // let the drawer start closing before scrolling
                    setTimeout(function () { scrollToHeading(id); }, 100);
                } else {
                    scrollToHeading(id);
                }
            });

            const li = document.createElement('li');
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    function highlightCurrent() {
        let currentId = '';
        headings.forEach(function (h) {
            if (h.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) {
                currentId = h.id;
            }
        });
        list.querySelectorAll('a').forEach(function (a) {
            a.classList.toggle('toc-active', a.getAttribute('href') === '#' + currentId);
        });
    }

    buildList();
    sidebar.classList.add('has-headings');
    toggle.classList.add('has-headings');

    window.addEventListener('scroll', highlightCurrent, { passive: true });
    toggle.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
})();
