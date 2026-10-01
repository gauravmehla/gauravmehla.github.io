// Opens the terminal with ` (backtick) or any [data-terminal-open] button.
// Small on purpose: the terminal itself is only downloaded the first time
// someone opens it.
(function () {
    'use strict';

    const MODULE_URL = '/assets/js/terminal/terminal.js';
    let loading = null;

    function isTyping(el) {
        return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    }

    function load() {
        if (!loading) {
            loading = import(MODULE_URL)
                .then(function (m) { return m.createTerminal(); })
                .catch(function (err) {
                    loading = null;
                    console.warn('Terminal failed to load', err);
                    throw err;
                });
        }
        return loading;
    }

    function toggle(opener) {
        load().then(function (t) { t.toggle(opener); }, function () {});
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== '`' || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
        e.preventDefault();
        toggle(document.activeElement);
    });

    // Buttons stay hidden without JS, since they'd do nothing
    document.querySelectorAll('[data-terminal-open]').forEach(function (btn) {
        btn.hidden = false;
        btn.addEventListener('click', function () { toggle(btn); });
    });
})();
