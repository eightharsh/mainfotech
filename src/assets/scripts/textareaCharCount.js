function bindTextareaCharCount(textarea) {
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  const counterId = textarea.dataset.charCountFor;
  if (!counterId) return;

  const counter = document.getElementById(counterId);
  if (!counter) return;

  if (textarea.dataset.charCountBound === 'true') return;
  textarea.dataset.charCountBound = 'true';

  const update = () => {
    counter.textContent = String(textarea.value.length);
  };

  textarea.addEventListener('input', update);
  textarea.form?.addEventListener('reset', () => {
    window.requestAnimationFrame(update);
  });
  update();
}

function initTextareaCharCount() {
  document
    .querySelectorAll('textarea[data-char-count-for]')
    .forEach(bindTextareaCharCount);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextareaCharCount);
} else {
  initTextareaCharCount();
}

document.addEventListener('astro:page-load', initTextareaCharCount);

export {};
