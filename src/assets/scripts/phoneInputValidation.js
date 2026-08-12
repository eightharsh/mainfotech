function bindPhoneValidation(input) {
  if (!(input instanceof HTMLInputElement)) return;
  if (input.dataset.phoneValidationBound === 'true') return;

  input.dataset.phoneValidationBound = 'true';

  const min = Number(input.dataset.phoneMinDigits) || 0;
  const max = Number(input.dataset.phoneMaxDigits) || 0;

  const validate = () => {
    const digits = input.value.replace(/\D/g, '');

    if (!digits && !input.required) {
      input.setCustomValidity('');
      return;
    }

    if (!digits && input.required) {
      input.setCustomValidity('Please enter your phone number.');
      return;
    }

    if (min && digits.length < min) {
      input.setCustomValidity(`Phone number must be at least ${min} digits.`);
      return;
    }

    if (max && digits.length > max) {
      input.setCustomValidity(`Phone number must not exceed ${max} digits.`);
      return;
    }

    input.setCustomValidity('');
  };

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, max || undefined);
    validate();
  });
  input.addEventListener('blur', validate);
  validate();
}

function initPhoneValidation() {
  document
    .querySelectorAll('[data-phone-min-digits], [data-phone-max-digits]')
    .forEach(bindPhoneValidation);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhoneValidation);
} else {
  initPhoneValidation();
}

document.addEventListener('astro:page-load', initPhoneValidation);

export {};
