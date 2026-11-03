import type { Exercise } from './exercise-types';

const SPRITE_URL = new URL('../../img/sprite.svg', import.meta.url).href;
const MAX_RATING = 5;

type Value = string | number | undefined;

const hasValue = (value: Value): value is string | number =>
  value !== undefined && value !== null && value !== '';

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

function createMedia(gifUrl: Value, name = ''): string {
  const content = hasValue(gifUrl)
    ? `<img src="${gifUrl}" alt="${capitalize(name)}" />`
    : '<span class="exercise-image-empty">No image available</span>';

  return `<div class="exercise-image">${content}</div>`;
}

function createStars(rating: number): string {
  const value = rating.toFixed(1);
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
    <div class="star-rating" role="img" aria-label="Rating ${value} out of ${MAX_RATING}">
      <span class="star-rating-value">${value}</span>
      <ul class="star-rating-list">${stars}</ul>
    </div>`;
}

function createHead(name: Value, rating: Value): string {
  const title = hasValue(name)
    ? `<h3 class="exercise-title">${capitalize(String(name))}</h3>`
    : '';
  const stars = hasValue(rating) ? createStars(Number(rating)) : '';

  return title || stars ? `<div class="exercise-content-head">${title}${stars}</div>` : '';
}

function createInfoItem(label: string, value: Value): string {
  return hasValue(value)
    ? `
      <li>
        <span>${label}</span>
        <p>${value}</p>
      </li>`
    : '';
}

function formatCalories(burnedCalories: Value, time: Value): Value {
  if (!hasValue(burnedCalories)) return undefined;
  return hasValue(time) ? `${burnedCalories}/${time} min` : burnedCalories;
}

function createInfo(exercise: Exercise): string {
  const { target, bodyPart, equipment, popularity, burnedCalories, time } = exercise;
  const items = [
    createInfoItem('Target', target),
    createInfoItem('Body Part', bodyPart),
    createInfoItem('Equipment', equipment),
    createInfoItem('Popular', popularity),
    createInfoItem('Burned calories', formatCalories(burnedCalories, time)),
  ].join('');

  return items ? `<ul class="exercise-info">${items}</ul>` : '';
}

function createDescription(description: Value): string {
  return hasValue(description) ? `<p class="exercise-description">${description}</p>` : '';
}

function createButtons(id: string): string {
  return `
    <ul class="popup-buttons">
      <li>
        <button type="button" class="popup-button white" data-add-to-favorites="${id}">
          <span>Add to favorites</span>
          <svg><use href="${SPRITE_URL}#heart"></use></svg>
        </button>
      </li>
      <li>
        <button type="button" class="popup-button" data-popup-open="add-rating-popup">
          <span>Give a rating</span>
        </button>
      </li>
    </ul>`;
}

export function createExerciseMarkup(exercise: Exercise): string {
  const { _id, name, gifUrl, rating, description } = exercise;

  return `
    ${createMedia(gifUrl, name)}
    <div class="exercise-content">
      ${createHead(name, rating)}
      ${createInfo(exercise)}
      ${createDescription(description)}
      ${createButtons(_id)}
    </div>`;
}

export function createErrorMarkup(message: string): string {
  return `<p class="exercise-error">${message}</p>`;
}
