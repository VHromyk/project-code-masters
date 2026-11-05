import { isFavorite, toggleFavorite } from './favorites-storage';

const SPRITE_URL = new URL('../../img/sprite.svg', import.meta.url).href;
const ADD_LABEL = 'Add to favorites';
const REMOVE_LABEL = 'Remove from favorites';

function syncFavoriteButton(button: HTMLElement): void {
  const id = button.dataset.addToFavorites;
  if (!id) return;

  const favorite = isFavorite(id);
  button.classList.toggle('is-favorite', favorite);
  button.classList.toggle('popup-button--remove', favorite);

  const label = button.querySelector('span');
  if (label) label.textContent = favorite ? REMOVE_LABEL : ADD_LABEL;

  const iconUse = button.querySelector('use');
  if (iconUse) {
    const symbol = favorite ? 'card-trash' : 'heart';
    iconUse.setAttribute('href', `${SPRITE_URL}#${symbol}`);
  }
}

export function updateFavoriteButtons(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLElement>('[data-add-to-favorites]')
    .forEach(syncFavoriteButton);
}

document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>(
    '[data-add-to-favorites]'
  );
  const id = button?.dataset.addToFavorites;

  if (!button || !id) return;

  toggleFavorite(id);
  syncFavoriteButton(button);
});
