import { isFavorite, toggleFavorite } from './favorites-storage';

export function updateFavoriteButtons(root: ParentNode = document): void {
  const buttons = root.querySelectorAll<HTMLElement>('[data-add-to-favorites]');

  buttons.forEach(button => {
    const id = button.dataset.addToFavorites;
    if (id) button.classList.toggle('is-favorite', isFavorite(id));
  });
}

document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>(
    '[data-add-to-favorites]'
  );
  const id = button?.dataset.addToFavorites;

  if (button && id) button.classList.toggle('is-favorite', toggleFavorite(id));
});
