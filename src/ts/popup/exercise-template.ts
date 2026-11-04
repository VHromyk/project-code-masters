import type { Exercise } from './types';

const SPRITE_URL = new URL('../../img/sprite.svg', import.meta.url).href;
const MAX_RATING = 5;

export function createExerciseMarkup(exercise: Exercise): string {
  const {
    _id,
    name,
    gifUrl,
    rating,
    target,
    bodyPart,
    equipment,
    popularity,
    burnedCalories,
    time,
    description,
  } = exercise;

  const title = name ? name[0].toUpperCase() + name.slice(1) : '';

  const image = gifUrl
    ? `<img src="${gifUrl}" alt="${title}" />`
    : '<span class="exercise-image-empty">No image available</span>';

  let head = '';
  if (title) head += `<h3 class="exercise-title">${title}</h3>`;
  if (typeof rating === 'number') head += createStars(rating);

  let calories = '';
  if (typeof burnedCalories === 'number') {
    calories = time ? `${burnedCalories}/${time} min` : `${burnedCalories}`;
  }

  const infoItems = [
    { label: 'Target', value: target },
    { label: 'Body Part', value: bodyPart },
    { label: 'Equipment', value: equipment },
    { label: 'Popular', value: popularity },
    { label: 'Burned calories', value: calories },
  ]
    .filter(item => item.value !== undefined && item.value !== '')
    .map(item => `<li><span>${item.label}</span><p>${item.value}</p></li>`)
    .join('');

  return `
    <div class="exercise-image">${image}</div>

    <div class="exercise-content">
      ${head ? `<div class="exercise-content-head">${head}</div>` : ''}
      ${infoItems ? `<ul class="exercise-info">${infoItems}</ul>` : ''}
      ${description ? `<p class="exercise-description">${description}</p>` : ''}

      <ul class="popup-buttons">
        <li>
          <button type="button" class="popup-button white" data-add-to-favorites="${_id}">
            <span>Add to favorites</span>
            <svg><use href="${SPRITE_URL}#heart"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="popup-button" data-popup-open="add-rating-popup" data-rate-exercise="${_id}">
            <span>Give a rating</span>
          </button>
        </li>
      </ul>
    </div>`;
}

function createStars(rating: number): string {
  let stars = '';

  for (let i = 0; i < MAX_RATING; i++) {
    const fill = Math.min(Math.max(rating - i, 0), 1) * 100;

    stars += `
      <li class="star-rating-item" style="--fill: ${fill}%">
        <svg class="star-rating-icon"><use href="${SPRITE_URL}#rating-star"></use></svg>
        <svg class="star-rating-icon star-rating-icon-fill"><use href="${SPRITE_URL}#rating-star"></use></svg>
      </li>`;
  }

  return `
    <div class="star-rating" role="img" aria-label="Rating ${rating.toFixed(1)} out of ${MAX_RATING}">
      <span class="star-rating-value">${rating.toFixed(1)}</span>
      <ul class="star-rating-list">${stars}</ul>
    </div>`;
}
