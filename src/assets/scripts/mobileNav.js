// Full-screen mobile navigation with document-level delegation so it
// survives Astro view transitions when the navbar DOM is swapped.

import { lockSiteScroll, unlockSiteScroll } from '@scripts/scrollLock.js';

const MENU_ID = 'mobile-nav-menu';
const TOGGLE_ID = 'mobile-nav-toggle';
const CLOSE_ID = 'mobile-nav-close';

function getElements() {
  const menu = document.getElementById(MENU_ID);
  const toggle = document.getElementById(TOGGLE_ID);
  if (!menu || !toggle) return null;
  return { menu, toggle };
}

/**
 * @param {HTMLElement} menu
 * @param {HTMLButtonElement} toggle
 */
function openMenu(menu, toggle) {
  menu.dataset.open = 'true';
  menu.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
  menu.classList.add('opacity-100', 'pointer-events-auto');
  menu.setAttribute('aria-hidden', 'false');
  menu.removeAttribute('inert');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close menu');
  lockSiteScroll();

  const closeBtn = document.getElementById(CLOSE_ID);
  if (closeBtn instanceof HTMLElement) {
    window.requestAnimationFrame(() => closeBtn.focus());
  }
}

/**
 * @param {HTMLElement} menu
 * @param {HTMLButtonElement} toggle
 */
function closeMenu(menu, toggle) {
  delete menu.dataset.open;
  menu.classList.add('invisible', 'opacity-0', 'pointer-events-none');
  menu.classList.remove('opacity-100', 'pointer-events-auto');
  menu.setAttribute('aria-hidden', 'true');
  menu.setAttribute('inert', '');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  unlockSiteScroll();
}

function resetMenuState() {
  const elements = getElements();
  if (!elements) {
    unlockSiteScroll();
    return;
  }
  closeMenu(elements.menu, elements.toggle);
}

function bindMobileNav() {
  if (window.__mobileNavBound) return;
  window.__mobileNavBound = true;

  document.addEventListener('click', e => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.closest(`#${TOGGLE_ID}`)) {
      const elements = getElements();
      if (!elements) return;
      const { menu, toggle } = elements;
      if (toggle.getAttribute('aria-expanded') === 'true')
        closeMenu(menu, toggle);
      else openMenu(menu, toggle);
      return;
    }

    if (target.closest(`#${CLOSE_ID}`)) {
      const elements = getElements();
      if (!elements) return;
      const { menu, toggle } = elements;
      if (toggle.getAttribute('aria-expanded') === 'true')
        closeMenu(menu, toggle);
      return;
    }

    if (target.closest(`#${MENU_ID} a[href]`)) {
      const elements = getElements();
      if (!elements) return;
      const { menu, toggle } = elements;
      if (toggle.getAttribute('aria-expanded') === 'true')
        closeMenu(menu, toggle);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const elements = getElements();
    if (!elements) return;
    const { menu, toggle } = elements;
    if (toggle.getAttribute('aria-expanded') === 'true')
      closeMenu(menu, toggle);
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    if (!e.matches) return;
    const elements = getElements();
    if (!elements) return;
    const { menu, toggle } = elements;
    if (toggle.getAttribute('aria-expanded') === 'true')
      closeMenu(menu, toggle);
  });

  document.addEventListener('astro:page-load', resetMenuState);
}

bindMobileNav();

export {};
