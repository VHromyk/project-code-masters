import {
  changeFiltersState,
  setCurrentFilter,
  updateCategoryName,
  updateCloseButtonHiding,
} from '../filters/states';

import type { FilterName } from '../types/exercise';
import { Filter } from '../types/filter';

import {
  exercisesLimit,
  loadExercises,
} from './exercises-page';

import { isFilterName } from '../utils/query-params';

const categoriesList =
  document.querySelector<HTMLElement>('.js-categories-list');

const categoriesContent =
  document.querySelector<HTMLElement>('.categories-content');

const categoriesSection =
  document.querySelector<HTMLElement>('.categories');

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

export function openCategoryExercises({
  filter,
  category,
  page = 1,
  keyword,
}: {
  filter: FilterName;
  category: string;
  page?: number;
  keyword?: string;
}): void {
  if (categoriesContent) categoriesContent.hidden = true;
  if (categoriesSection) categoriesSection.hidden = true;
  if (exercisesSection) exercisesSection.hidden = false;

  changeFiltersState();
  setCurrentFilter(filter as Filter);
  updateCategoryName(category);

  if (filterInput) filterInput.value = filter;
  if (searchInput) searchInput.value = keyword ?? '';
  updateCloseButtonHiding();

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
    category,
    page,
    keyword,
    limit: exercisesLimit(),
  });
}

categoriesList?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;

  const button =
    event.target.closest<HTMLButtonElement>('.category-card-btn');

  const filter = button?.dataset.filter;
  const name = button?.dataset.name;

  if (!filter || !name || !isFilterName(filter)) return;

  openCategoryExercises({
    filter,
    category: name,
    page: 1,
  });
});
