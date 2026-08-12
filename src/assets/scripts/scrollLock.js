/** Lock/unlock document scroll (modals, mobile nav). */

let lockedScrollY = 0;
let lockCount = 0;

export function getSiteScrollRoot() {
  return document.scrollingElement || document.documentElement;
}

export function lockSiteScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  lockedScrollY = window.scrollY;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  window.__lenis?.stop?.();
}

export function unlockSiteScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, lockedScrollY);
  window.__lenis?.start?.();
}
