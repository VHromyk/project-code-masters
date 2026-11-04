import axios from 'axios';

const SUBSCRIPTION_URL = 'https://your-energy.b.goit.study/api/subscription';

const SUCCESS_MESSAGE = 'Thank you for subscribing!';
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later.';
const NETWORK_ERROR_MESSAGE = 'Check your internet connection and try again.';
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please enter a valid email.',
  409: 'This email is already subscribed.',
};

const form = document.querySelector<HTMLFormElement>('.footer__form');
const submitButton = form?.querySelector<HTMLButtonElement>('[type="submit"]');
const messageEl = form?.querySelector<HTMLElement>('[data-subscription-message]');

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return DEFAULT_ERROR_MESSAGE;
  if (!error.response) return NETWORK_ERROR_MESSAGE;

  return ERROR_MESSAGES[error.response.status] || DEFAULT_ERROR_MESSAGE;
}

function showMessage(text: string, isError = false): void {
  if (!messageEl) return;

  messageEl.textContent = text;
  messageEl.classList.toggle('is-error', isError);
}

function setLoading(value: boolean): void {
  if (submitButton) submitButton.disabled = value;
}

// Fires only when the browser's built-in `required` + `pattern` checks pass.
async function onSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!form || submitButton?.disabled) return;

  const email = String(new FormData(form).get('email')).trim();

  showMessage('');
  setLoading(true);

  try {
    await axios.post(SUBSCRIPTION_URL, { email }, { timeout: 10000 });
    showMessage(SUCCESS_MESSAGE);
    form.reset();
  } catch (error) {
    showMessage(getErrorMessage(error), true);
  } finally {
    setLoading(false);
  }
}

form?.addEventListener('submit', onSubmit);
form?.addEventListener('input', () => showMessage(''));
