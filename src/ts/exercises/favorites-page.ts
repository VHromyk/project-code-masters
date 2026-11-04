import { getExerciseById } from '../popup/exercise-api';
import type { Exercise } from '../popup/types';
import { getFavorites, toggleFavorite } from '../add-to-favorites/favorites-storage';
import { createExerciseCards } from '../exercises/exercises-cards';
import { renderPagination } from '../exercises/pagination';

const FAVORITES_CHANGED = 'favorites:changed'; 

const EMPTY_TEXT =
  "It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.";

const desktop = window.matchMedia('(min-width: 1440px)');
const mobile = window.matchMedia('(max-width: 767px)');

const pageSize = (): number => (desktop.matches ? Number.MAX_SAFE_INTEGER : mobile.matches ? 8 : 10);

const list = document.querySelector<HTMLUListElement>('#favorites-list');

if (!list) {
  console.warn('[favorites] don\'t have <ul id="favorites-list"> у favorites.html');
} else {
  const empty = document.createElement('p');
  empty.className = 'favorites__empty';
  empty.textContent = EMPTY_TEXT;
  empty.hidden = true;
  list.after(empty);

  const pagination = document.createElement('nav');
  pagination.className = 'pagination';
  pagination.setAttribute('aria-label', 'Pagination');
  empty.after(pagination);

  const cache = new Map<string, Exercise>();
  let renderId = 0; 
  let page = 1;

  async function render(): Promise<void> {
    const currentRender = ++renderId;
    const ids = getFavorites().filter((id): id is string => typeof id === 'string');

    const size = pageSize();
    const totalPages = Math.max(1, Math.ceil(ids.length / size));
    page = Math.min(page, totalPages);
    const pageIds = ids.slice((page - 1) * size, page * size);

    const missing = pageIds.filter(id => !cache.has(id));
    const loaded = await Promise.allSettled(missing.map(id => getExerciseById(id)));
    if (currentRender !== renderId) return;
    loaded.forEach(result => {
      if (result.status === 'fulfilled') cache.set(result.value._id, result.value);
    });

    const items = pageIds.flatMap(id => cache.get(id) ?? []);
    list!.replaceChildren(...createExerciseCards(items, 'favorites'));
    list!.hidden = items.length === 0;
    empty.hidden = ids.length > 0;

   renderPagination(pagination, { page, totalPages }); 

    list!.classList.toggle('has-scroll', list!.scrollHeight > list!.clientHeight);
  }

  const refresh = (): void => void render();

  list.addEventListener('click', event => {
    const target = event.target as Element;
    if (!target.closest('[data-action="remove"]')) return;
    const id = target.closest<HTMLElement>('.exercise-card')?.dataset.id;
    if (!id) return;
    toggleFavorite(id);
    refresh();
  });

  pagination.addEventListener('click', event => {
    const next = Number((event.target as Element).closest<HTMLElement>('[data-page]')?.dataset.page);
    if (!next) return;
    page = next;
    refresh();
  });

  document.addEventListener('click', event => {
    if ((event.target as Element).closest('[data-add-to-favorites]')) setTimeout(refresh, 0);
  });

  document.addEventListener(FAVORITES_CHANGED, refresh);
  window.addEventListener('storage', event => {
    if (event.key === 'favorites' || event.key === null) refresh();
  });

  desktop.addEventListener('change', refresh);
  mobile.addEventListener('change', refresh);

  refresh();
}