// Progressive scroll-reveal for elements marked with [data-reveal].
// If IntersectionObserver is unavailable, elements simply stay visible.

function revealAll() {
  document
    .querySelectorAll('[data-reveal]')
    .forEach(el => el.classList.add('is-visible'));
}

function initReveal() {
  const nodes = document.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (!nodes.length) return;

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    revealAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  nodes.forEach(el => io.observe(el));
}

initReveal();
document.addEventListener('astro:page-load', initReveal);

export {};
