// Theme toggle (paper ↔ terminal).
// The initial theme is applied by the inline script in _includes/head.html
// before first paint; this file only wires up the toggle button.
(function () {
    'use strict';

    const THEME_KEY = 'gm-theme';

    function currentTheme() {
        return document.documentElement.className === 'theme-terminal' ? 'terminal' : 'paper';
    }

    function setButtonIcon(btn, theme) {
        btn.textContent = theme === 'paper' ? '☾' : '☀';
    }

    function applyTheme(theme, btn) {
        document.documentElement.className = 'theme-' + theme;
        localStorage.setItem(THEME_KEY, theme);
        setButtonIcon(btn, theme);
    }

    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    setButtonIcon(btn, currentTheme());
    btn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'paper' ? 'terminal' : 'paper', btn);
    });
})();
