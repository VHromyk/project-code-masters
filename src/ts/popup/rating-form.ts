import { addExerciseRating } from './exercise-api';
import { getErrorMessage } from './http-client';
import { checkForm, resetForm, showFormErrors } from './popup-form-validation';
import { showExercise } from './exercise-popup';

const popupEl = document.getElementById('add-rating-popup');
const form = popupEl?.querySelector<HTMLFormElement>('form[data-form]');
const closeButton = popupEl?.querySelector<HTMLElement>('.popup-close');
const rateValue = form?.querySelector<HTMLElement>('[data-rate-value]');
const submitButton = form?.querySelector<HTMLButtonElement>('[type="submit"]');

const ERROR_MESSAGES = {
  400: 'Please check the form data.',
  404: 'Exercise not found.',
  409: 'You have already rated this exercise with this email.',
};

let exerciseId = '';
let isLoading = false;

function openRatingForm(id: string): void {
  if (!form || !closeButton) return;

  exerciseId = id;
  resetForm(form);
  closeButton.dataset.showExercise = id;
  updateRateValue(0);
}

function updateRateValue(rate: number): void {
  if (rateValue) rateValue.textContent = rate.toFixed(1);
}

function setLoading(value: boolean): void {
  isLoading = value;

  if (!submitButton) return;
  submitButton.disabled = value;
  submitButton.classList.toggle('pending', value);
}

async function onSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!form || isLoading || !checkForm(form)) return;

  const data = new FormData(form);
  const payload = {
    rate: Number(data.get('rate')),
    email: String(data.get('email')).trim(),
    review: String(data.get('review')).trim(),
  };

  setLoading(true);

  try {
    await addExerciseRating(exerciseId, payload);
    showExercise(exerciseId);
  } catch (error) {
    showFormErrors(form, [{ message: getErrorMessage(error, ERROR_MESSAGES) }]);
  } finally {
    setLoading(false);
  }
}

document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>(
    '[data-rate-exercise]'
  );

  if (button?.dataset.rateExercise) openRatingForm(button.dataset.rateExercise);
});

form?.addEventListener('change', event => {
  const input = event.target as HTMLInputElement;
  if (input.name === 'rate') updateRateValue(Number(input.value));
});

form?.addEventListener('submit', onSubmit);
