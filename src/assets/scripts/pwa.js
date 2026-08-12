// PWA install — MOBILE ONLY (Android + iOS). The install button is never shown
// on desktop (macOS / Windows). Android uses the native install prompt; iOS
// Safari shows an "Add to Home Screen" hint (Safari has no install API).

const ua = navigator.userAgent || '';
const isIOS =
  /iPad|iPhone|iPod/.test(ua) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);
const isMobile = isIOS || isAndroid;

let deferredPrompt = null;

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function shouldOffer() {
  if (!isMobile || isStandalone()) return false;
  return isIOS || !!deferredPrompt;
}

function setInstallVisible(visible) {
  document.querySelectorAll('[data-pwa-install]').forEach(el => {
    el.classList.toggle('hidden', !visible);
    el.classList.toggle('inline-flex', visible);
  });
}

function syncVisibility() {
  setInstallVisible(shouldOffer());
}

// iOS Safari: show a small instruction toast (no programmatic install exists).
function showIosHint() {
  let el = document.getElementById('ios-install-hint');
  if (el) {
    el.remove();
    return;
  }
  el = document.createElement('div');
  el.id = 'ios-install-hint';
  el.setAttribute('role', 'dialog');
  el.style.cssText =
    'position:fixed;left:50%;bottom:calc(1rem + env(safe-area-inset-bottom));' +
    'transform:translateX(-50%);z-index:120;width:min(22rem,calc(100vw - 2rem));' +
    'background:#fff;color:#0f172a;border:1px solid #e5e7eb;border-radius:1rem;' +
    'box-shadow:0 18px 44px -20px rgba(23,37,94,.45);padding:14px 16px;' +
    'font:500 14px/1.5 Inter,system-ui,sans-serif;';
  el.innerHTML =
    '<div style="display:flex;gap:10px;align-items:flex-start">' +
    '<span style="font-size:20px;line-height:1">📲</span>' +
    '<div>To install, tap the <b>Share</b> button ' +
    '<span style="display:inline-block;transform:translateY(2px)">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V3M8 7l4-4 4 4"/><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/></svg>' +
    '</span> then choose <b>Add to Home Screen</b>.</div></div>';
  document.body.appendChild(el);
  setTimeout(() => el && el.remove(), 8000);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function initInstall() {
  if (window.__pwaInstallBound) return;
  window.__pwaInstallBound = true;

  // Android / Chromium mobile: capture the install prompt.
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    syncVisibility();
  });

  document.addEventListener('click', async event => {
    const btn = event.target.closest?.('[data-pwa-install]');
    if (!btn) return;
    event.preventDefault();
    if (isIOS) {
      showIosHint();
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => {});
      deferredPrompt = null;
      setInstallVisible(false);
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    setInstallVisible(false);
  });

  document.addEventListener('astro:page-load', syncVisibility);

  // iOS has no beforeinstallprompt — reveal the button right away.
  syncVisibility();
}

registerServiceWorker();
initInstall();

export {};
