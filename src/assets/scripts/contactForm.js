function setStatus(statusElement, message, variant) {
  if (!(statusElement instanceof HTMLElement)) return;

  statusElement.textContent = message;
  statusElement.classList.remove(
    'hidden',
    'text-red-600',
    'text-emerald-700',
    'text-ink',
    'opacity-0'
  );
  statusElement.classList.add('transition-opacity', 'duration-500');

  if (variant === 'success') {
    statusElement.classList.add('text-emerald-700');
    return;
  }

  if (variant === 'error') {
    statusElement.classList.add('text-red-600');
    return;
  }

  statusElement.classList.add('text-ink');
}

function hideStatus(statusElement) {
  if (!(statusElement instanceof HTMLElement)) return;
  statusElement.classList.add('opacity-0');
  window.setTimeout(() => {
    statusElement.textContent = '';
    statusElement.classList.add('hidden');
    statusElement.classList.remove('opacity-0');
  }, 350);
}

function setButtonLoading(button, label) {
  if (!(button instanceof HTMLButtonElement)) return;
  button.disabled = true;
  button.classList.add(
    'cursor-wait',
    'shadow-[0_20px_45px_-25px_rgba(30,58,255,0.95)]'
  );
  button.innerHTML = `<span class="inline-flex items-center gap-3"><span class="relative flex h-4 w-4"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/35 opacity-75"></span><span class="relative inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"></span></span><span>${label}</span></span>`;
}

function setButtonLabel(button, label) {
  if (!(button instanceof HTMLButtonElement)) return;
  button.disabled = false;
  button.classList.remove(
    'cursor-wait',
    'shadow-[0_20px_45px_-25px_rgba(30,58,255,0.95)]'
  );
  button.innerHTML = label;
}

function buildWeb3FormsPayload(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  const firstName = String(payload.firstName ?? '').trim();
  const lastName = String(payload.lastName ?? '').trim();
  const email = String(payload.email ?? '').trim();

  if (!payload.name && (firstName || lastName)) {
    payload.name = [firstName, lastName].filter(Boolean).join(' ');
  }

  if (email && !payload.replyto) {
    payload.replyto = email;
  }

  return payload;
}

async function submitContactForm(form) {
  const endpoint = form.action || '/api/contact';
  const payload = buildWeb3FormsPayload(form);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || 'Sorry, we could not send your message right now.'
    );
  }

  return data;
}

async function handleContactFormSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.matches('[data-contact-form]')) return;

  // Cancel the native submit AND stop Astro's ClientRouter (which otherwise
  // intercepts the submit, navigates to /api/contact, and renders a 404).
  event.preventDefault();
  event.stopImmediatePropagation();

  if (form.getAttribute('aria-busy') === 'true') return;

  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText =
    submitButton?.textContent?.trim() || 'Send Message';
  const accessKeyField = form.querySelector('input[name="access_key"]');
  const successMessage =
    form.dataset.successMessage || 'Thanks! Your message has been sent.';
  const errorMessage =
    form.dataset.errorMessage ||
    'Sorry, we could not send your message right now. Please try again.';
  const sendingMessage = form.dataset.sendingMessage || 'Sending your message…';
  const successStorageKey = form.dataset.successStorageKey?.trim();
  let successTimeoutId = 0;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (
    accessKeyField instanceof HTMLInputElement &&
    !accessKeyField.value.trim()
  ) {
    setStatus(
      status,
      'Contact form is not configured yet. Please try again later.',
      'error'
    );
    return;
  }

  setStatus(status, sendingMessage, 'info');
  form.setAttribute('aria-busy', 'true');
  setButtonLoading(submitButton, sendingMessage);

  try {
    await submitContactForm(form);

    form.reset();
    if (successStorageKey) {
      try {
        window.localStorage.setItem(successStorageKey, 'true');
      } catch {
        // Ignore storage failures and keep the form functional.
      }
    }
    setStatus(status, successMessage, 'success');
    setButtonLabel(submitButton, originalButtonText);
    form.dispatchEvent(
      new CustomEvent('contact-form:success', {
        bubbles: true,
        detail: { message: successMessage },
      })
    );
    successTimeoutId = window.setTimeout(() => {
      hideStatus(status);
      successTimeoutId = 0;
    }, 5000);
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : errorMessage;
    setStatus(status, message, 'error');
    setButtonLabel(submitButton, originalButtonText);
    form.dispatchEvent(
      new CustomEvent('contact-form:error', {
        bubbles: true,
        detail: { message },
      })
    );
  } finally {
    form.removeAttribute('aria-busy');
  }
}

function bindContactForms() {
  if (window.__contactFormBound) return;
  window.__contactFormBound = true;
  // Capture phase so we run BEFORE Astro's ClientRouter submit handler.
  document.addEventListener('submit', handleContactFormSubmit, true);
}

bindContactForms();
document.addEventListener('astro:page-load', bindContactForms);

export {};
