import type { FilterName } from '../types/exercise';
import { exercisesLimit, loadExercises } from './exercises-page';

const categoriesList =
  document.querySelector<HTMLElement>('.js-categories-list');

const categoriesContent =
  document.querySelector<HTMLElement>('.categories-content');

const exercisesSection =
  document.querySelector<HTMLElement>('#exercises');

const breadcrumb =
  document.querySelector<HTMLElement>('.categories-breadcrumb');

const selectedName =
  document.querySelector<HTMLElement>('.categories-selected');

const searchForm =
  document.querySelector<HTMLFormElement>('.categories-search');

const searchInput =
  document.querySelector<HTMLInputElement>('.categories-search-input');

const searchButton =
  document.querySelector<HTMLButtonElement>(
    '.categories-search-button'
  );

const searchIcon =
  document.querySelector<SVGElement>('.search-icon');

const clearIcon =
  document.querySelector<SVGElement>('.search-clear-icon');

let searchTimer: ReturnType<typeof setTimeout> | undefined;

function updateSearchIcon(): void {
  const hasText = Boolean(searchInput?.value.length);

  searchIcon?.toggleAttribute('hidden', hasText);
  clearIcon?.toggleAttribute('hidden', !hasText);

  searchButton?.setAttribute(
    'aria-label',
    hasText ? 'Clear search' : 'Search'
  );
}

let selectedCategory: {
  filter: FilterName;
  name: string;
} | null = null;

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

  selectedCategory = { filter, name };

  if (categoriesContent) categoriesContent.hidden = true;
  if (exercisesSection) exercisesSection.hidden = false;

  if (selectedName) selectedName.textContent = name;
  if (breadcrumb) breadcrumb.hidden = false;

  if (searchForm) searchForm.hidden = false;
  if (searchInput) searchInput.value = '';
  clearTimeout(searchTimer);
  updateSearchIcon();

  void loadExercises({
    filter,
    category: name,
    page: 1,
    limit: exercisesLimit(),
  });
});

function runSearch(): void {
  clearTimeout(searchTimer);

  if (
    !selectedCategory ||
    !exercisesSection ||
    exercisesSection.hidden
  ) {
    return;
  }

  void loadExercises({
    filter: selectedCategory.filter,
    category: selectedCategory.name,
    keyword: searchInput?.value.trim() || undefined,
    page: 1,
    limit: exercisesLimit(),
  });
}

// Шукаємо через 300 мс після останнього введеного символу.
searchInput?.addEventListener('input', () => {
  updateSearchIcon();

  clearTimeout(searchTimer);

  searchTimer = setTimeout(runSearch, 300);
});

// Enter запускає пошук одразу.
searchForm?.addEventListener('submit', event => {
  event.preventDefault();
  runSearch();
});

// Якщо є текст — кнопка очищає поле та повертає всі вправи.
searchButton?.addEventListener('click', () => {
  if (!searchInput) return;

  if (searchInput.value.length > 0) {
    searchInput.value = '';
  }

  updateSearchIcon();
  runSearch();
  searchInput.focus();
});

updateSearchIcon();