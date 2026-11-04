export interface FormError {
  field?: string;
  message: string;
}

const DEFAULT_MESSAGE = 'This field is required';

export function checkForm(form: HTMLFormElement): boolean {
  const errors = validateForm(form);

  form.dataset.checked = 'true';
  showFormErrors(form, errors);

  return errors.length === 0;
}

export function validateForm(form: HTMLFormElement): FormError[] {
  const errors: FormError[] = [];
  const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    '[required], [pattern]'
  );

  fields.forEach(field => {
    if (!isFieldValid(form, field)) {
      errors.push({
        field: field.name,
        message: field.dataset.error || DEFAULT_MESSAGE,
      });
    }
  });

  return errors;
}

function isFieldValid(
  form: HTMLFormElement,
  field: HTMLInputElement | HTMLTextAreaElement
): boolean {
  if (field.type === 'radio') {
    return form.querySelector(`[name="${field.name}"]:checked`) !== null;
  }

  const value = field.value.trim();
  if (!value) return !field.required;

  const pattern = field.getAttribute('pattern');
  if (!pattern) return true;

  return new RegExp(pattern).test(value);
}

export function showFormErrors(form: HTMLFormElement, errors: FormError[]): void {
  clearFormErrors(form);

  const errorsBox = form.querySelector('[data-form-errors]');

  errors.forEach(error => {
    if (error.field) {
      form
        .querySelectorAll(`[name="${error.field}"]`)
        .forEach(element => element.classList.add('invalid'));
    }

    if (errorsBox) {
      const text = document.createElement('p');
      text.textContent = error.message;
      errorsBox.append(text);
    }
  });

  if (errorsBox && errors.length > 0) errorsBox.classList.add('active');
}

export function clearFormErrors(form: HTMLFormElement): void {
  form
    .querySelectorAll('.invalid')
    .forEach(element => element.classList.remove('invalid'));

  const errorsBox = form.querySelector('[data-form-errors]');
  if (!errorsBox) return;

  errorsBox.innerHTML = '';
  errorsBox.classList.remove('active');
}

export function resetForm(form: HTMLFormElement): void {
  form.reset();
  delete form.dataset.checked;
  clearFormErrors(form);
}

function onFieldChange(event: Event): void {
  const form = (event.target as Element).closest<HTMLFormElement>('form[data-form]');
  if (form?.dataset.checked) showFormErrors(form, validateForm(form));
}

document.addEventListener('input', onFieldChange);
document.addEventListener('change', onFieldChange);
