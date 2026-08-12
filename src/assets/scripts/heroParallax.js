// Hero "signature" depth for the framed product showcase:
//   • a subtle 3D tilt that follows the cursor (desktop / fine pointers only)
//   • a gentle scroll-driven parallax drift
// Both are pure transforms (compositor-friendly, no layout shift) and are fully
// skipped when the user prefers reduced motion. Progressive enhancement only.

function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scene = document.querySelector('[data-hero-scene]');
  const card = document.querySelector('[data-hero-tilt]');
  if (!scene || !card) return;
  if (card.dataset.parallaxBound === 'true') return;
  card.dataset.parallaxBound = 'true';

  // ── Scroll parallax ────────────────────────────────────────────────────
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Distance of the scene's centre from the viewport centre.
      const offset = rect.top + rect.height / 2 - vh / 2;
      // Drift a little slower than the scroll for a layered feel.
      card.style.setProperty('--py', `${(-offset * 0.05).toFixed(2)}px`);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Pointer tilt (desktop only) ────────────────────────────────────────
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const MAX_TILT = 4; // degrees
    scene.addEventListener('pointermove', e => {
      const r = scene.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(px * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-py * MAX_TILT).toFixed(2)}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }
}

initHeroParallax();
document.addEventListener('astro:page-load', initHeroParallax);

export {};
