// Click-to-zoom lightbox for the product detail page's main image.
// Vanilla JS, event-delegated on document (survives React Router navigation without any
// wiring into the app's own component tree) — deliberately NOT a React-state change, since
// this bundle has no build/test step and adding new hooks to an existing minified component
// risks hook-order bugs that are hard to catch here. Purely additive: click opens an overlay,
// nothing else on the page is touched.
(function () {
  'use strict';

  // Matches only the product-detail hero image container (aspect-square + rounded-3xl is a
  // unique combination — the product-card thumbnail in the grid uses aspect-square alone,
  // without rounded-3xl, so it's untouched by this selector).
  const HERO_SELECTOR = '.aspect-square.rounded-3xl img';

  const style = document.createElement('style');
  style.textContent = `
    ${HERO_SELECTOR} { cursor: zoom-in; }
    #img-lightbox-overlay {
      position: fixed; inset: 0; z-index: 2147483000;
      background: rgba(0,0,0,.85);
      display: flex; align-items: center; justify-content: center;
      padding: 24px; animation: img-lightbox-fade .15s ease-out;
    }
    @keyframes img-lightbox-fade { from { opacity: 0; } to { opacity: 1; } }
    #img-lightbox-overlay img {
      max-width: min(90vw, 900px); max-height: 85vh;
      object-fit: contain; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
    }
    #img-lightbox-close {
      position: absolute; top: 16px; right: 16px;
      width: 40px; height: 40px; border-radius: 9999px;
      background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3);
      color: #fff; font-size: 22px; line-height: 1; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    #img-lightbox-close:hover { background: rgba(255,255,255,.28); }
  `;
  document.head.appendChild(style);

  function openLightbox(src, alt) {
    if (document.getElementById('img-lightbox-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'img-lightbox-overlay';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'img-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function close() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest(HERO_SELECTOR);
    if (img && img.src) openLightbox(img.src, img.alt);
  });
})();
