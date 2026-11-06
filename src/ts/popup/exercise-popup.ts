import { popup } from './popup';
import { getExerciseById } from '../exercises/api-exercises';
import { getErrorMessage } from '../../api/api-errors';
import { createExerciseMarkup } from './exercise-template';
import { updateFavoriteButtons } from '../add-to-favorites/favorites-button';

const popupEl = document.getElementById('exercise-popup');
const content = popupEl?.querySelector<HTMLElement>('[data-exercise-content]');
const ERROR_MESSAGES = {
  404: 'Exercise not found.',
};

let currentId = '';

export async function showExercise(id: string): Promise<void> {
  if (!popupEl || !content) return;

  currentId = id;
  content.innerHTML = '';
  popupEl.classList.add('pending');
  popup?.open('exercise-popup');

  let markup = '';

  try {
    const exercise = await getExerciseById(id);
    markup = createExerciseMarkup(exercise);
  } catch (error) {
    markup = `<p class="exercise-error">${getErrorMessage(error, ERROR_MESSAGES)}</p>`;
  }

  if (currentId !== id) return;

  content.innerHTML = markup;
  updateFavoriteButtons(content);
  popupEl.classList.remove('pending');
}

document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>(
    '[data-show-exercise]'
  );

  if (button?.dataset.showExercise) showExercise(button.dataset.showExercise);
});
