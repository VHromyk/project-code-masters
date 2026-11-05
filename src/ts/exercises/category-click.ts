import {
  changeFiltersState,
  updateCategoryName,
} from '../filters/states';

import type { FilterName } from '../types/exercise';

import {
  exercisesLimit,
  loadExercises,
} from './exercises-page';

const categoriesList =
  document.querySelector<HTMLElement>('.js-categories-list');

const categoriesContent =
  document.querySelector<HTMLElement>('.categories-content');

const exercisesSection =
  document.querySelector<HTMLElement>('#exercises');

const filterInput =
  document.querySelector<HTMLInputElement>(
    '.filters-block-filter-input'
  );

const searchInput =
  document.querySelector<HTMLInputElement>(
    '.filters-block-search-input'
  );

function isFilter(value: string): value is FilterName {
  return (
    value === 'Muscles' ||
    value === 'Body parts' ||
    value === 'Equipment'
  );
}

categoriesList?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;

  const button =
    event.target.closest<HTMLButtonElement>('.category-card-btn');

  const filter = button?.dataset.filter;
  const name = button?.dataset.name;

  if (!filter || !name || !isFilter(filter)) return;

  // Приховуємо категорії разом із пагінацією.
  if (categoriesContent) categoriesContent.hidden = true;

  // Показуємо список вправ.
  if (exercisesSection) exercisesSection.hidden = false;

  // Перемикаємо нову панель у режим вправ
  // і показуємо назву вибраної категорії.
  changeFiltersState();
  updateCategoryName(name);

  // Передаємо фільтр у форму пошуку.
  if (filterInput) filterInput.value = filter;

  // Очищаємо попередній пошуковий запит.
  if (searchInput) searchInput.value = '';

  document
    .querySelector('.filters-search-icon')
    ?.removeAttribute('hidden');

  document
    .querySelector('.filters-clear-icon')
    ?.setAttribute('hidden', '');

  document
    .querySelector('.filters-block-search-input-button')
    ?.setAttribute('aria-label', 'Search');

  void loadExercises({
    filter,
    category: name,
    page: 1,
    limit: exercisesLimit(),
  });
});