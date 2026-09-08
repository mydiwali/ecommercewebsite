// Patches the compiled admin bundle (no React source ships in this repo) to add:
//  1) A working light/dark theme toggle for the admin panel.
// The React bundle (admin/assets/index-BymXIvPn.js) already renders ~100 "dark:" Tailwind
// classes throughout its JSX (sidebar, cards, settings, etc.), but the compiled stylesheet
// (admin/assets/index-BuTBeeTd.css) never had the matching dark-mode CSS rules generated for
// them. admin/assets/dark-mode.css (built via the Tailwind CLI against this bundle's own
// className strings) supplies those missing rules; this script supplies the toggle that
// flips the ".dark" class the CSS keys off of. It is injected outside React's #root subtree
// so React's re-renders never remove it.
(function () {
  'use strict';

  const STORAGE_KEY = 'admin-theme';

  function getStoredTheme() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (_) {
      return null;
    }
  }

  function preferredTheme() {
    return getStoredTheme() || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) { /* storage unavailable */ }
  }

  // Apply immediately (this script loads at the end of <body>, before the first paint
  // completes) so there's no flash of the wrong theme.
  let theme = preferredTheme();
  applyTheme(theme);

  const SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function buildButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'admin-theme-toggle';
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
    btn.style.cssText = [
      'position:fixed', 'bottom:20px', 'right:20px', 'z-index:2147483000',
      'width:44px', 'height:44px', 'border-radius:9999px', 'border:1px solid rgba(148,163,184,.4)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'background:#ffffff', 'color:#334155', 'box-shadow:0 4px 14px rgba(0,0,0,.18)',
      'cursor:pointer', 'transition:background .15s,color .15s,transform .15s'
    ].join(';');
    btn.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG;

    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.06)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'scale(1)'; });

    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      btn.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG;
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', btn.title);
      updateButtonColors();
    });

    return btn;
  }

  function updateButtonColors() {
    const btn = document.getElementById('admin-theme-toggle');
    if (!btn) return;
    if (theme === 'dark') {
      btn.style.background = '#1e293b';
      btn.style.color = '#e2e8f0';
      btn.style.borderColor = 'rgba(148,163,184,.3)';
    } else {
      btn.style.background = '#ffffff';
      btn.style.color = '#334155';
      btn.style.borderColor = 'rgba(148,163,184,.4)';
    }
  }

  function mount() {
    if (document.getElementById('admin-theme-toggle')) return;
    // Appended as a sibling of #root, not inside it, so React's reconciliation
    // (which only manages the #root subtree) never removes this button.
    document.body.appendChild(buildButton());
    updateButtonColors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
