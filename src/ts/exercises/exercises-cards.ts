import spriteUrl from '../../img/sprite.svg?url';
import type { CardVariant, Exercise } from './types-exercises';

const ICON_PREFIX = 'card-';

const icon = (name: string, size: number): string =>
  `<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="${spriteUrl}#${ICON_PREFIX}${name}"></use></svg>`;

const capitalize = (text = ''): string => (text ? text[0].toUpperCase() + text.slice(1) : '');

export function createExerciseCard(exercise: Exercise, variant: CardVariant = 'home'): HTMLLIElement {
  const { _id, name, burnedCalories, time, bodyPart, target, rating } = exercise;

  const card = document.createElement('li');
  card.className = 'exercise-card';
  card.dataset.id = _id;

  card.innerHTML = `
    <div class="exercise-card__top">
      <span class="exercise-card__badge">Workout</span>
      ${
        variant === 'home'
          ? `<span class="exercise-card__rating">${icon('star', 18)}</span>`
          : `<button class="exercise-card__remove" type="button" data-action="remove" aria-label="Remove from favorites">${icon('trash', 16)}</button>`
      }
      <button class="exercise-card__start" type="button" data-show-exercise="${_id}">Start ${icon('arrow', 16)}</button>
    </div>
    <div class="exercise-card__title">
      ${icon('runner', 24)}
      <h3 class="exercise-card__name"></h3>
    </div>
    <ul class="exercise-card__info">
      <li><span>Burned calories:</span></li>
      <li><span>Body part:</span></li>
      <li><span>Target:</span></li>
    </ul>
  `;

  const startBtn = card.querySelector<HTMLElement>('[data-show-exercise]');
  if (startBtn) startBtn.dataset.showExercise = _id;

  card.querySelector('.exercise-card__name')?.append(capitalize(name));
  card.querySelector('.exercise-card__rating')?.prepend(Number(rating ?? 0).toFixed(1));

  const [calories, bodyPartItem, targetItem] = card.querySelectorAll('.exercise-card__info li');
  calories.append(`${burnedCalories ?? 0} / ${time ?? 0} min`);
  bodyPartItem.append(capitalize(bodyPart));
  targetItem.append(capitalize(target));

  return card;
}

export function createExerciseCards(list: Exercise[], variant: CardVariant = 'home'): HTMLLIElement[] {
  return list.map(exercise => createExerciseCard(exercise, variant));
}