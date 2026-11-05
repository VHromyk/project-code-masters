import { Filter } from '../types/filter';
import { renderCategories } from '../category-main';
import { exercisesLimit, loadExercises } from '../exercises/exercises-page';
import { categoriesLimit } from '../category-main';

const refs = {
  filtersBlock: document.querySelector<HTMLElement>('.filters-block'),
  filtersBlockList: document.querySelector<HTMLElement>('.filters-block-list'),
  filtersBlockButtons: document.querySelectorAll<HTMLElement>('.filters-block-list-button'),
  filterInput: document.querySelector<HTMLInputElement>('.filters-block-filter-input'),
  form: document.querySelector<HTMLFormElement>('.filters-block-form')
}

function setCurrentFilter(filter: Filter) {
  const buttons = refs.filtersBlockButtons;
  buttons.forEach(button => {
    if (button instanceof HTMLElement === false) {
      console.error('Button is not an HTMLElement');
      return;
    }
    if (button.dataset.filter === filter) {
      button.classList.add('current');
    } else {
      button.classList.remove('current');
    }
  });
}

function setFilterInputValue(filter: Filter) {
  if (refs.filterInput) {
    refs.filterInput.value = filter;
  }
}

async function handleFilterClick(event: Event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest<HTMLButtonElement>(
    '.filters-block-list-button'
  );

  if (!button) return;

  const filter = button.dataset.filter;

  if (
    filter !== Filter.Muscles &&
    filter !== Filter.BodyParts &&
    filter !== Filter.Equipment
  ) {
    return;
  }

  setCurrentFilter(filter);
  setFilterInputValue(filter);

  const limit = categoriesLimit();

  await renderCategories(filter, 1, limit);
}

let searchTimer: ReturnType<typeof setTimeout> | undefined;

async function searchExercises(): Promise<void> {
  clearTimeout(searchTimer);

  if (refs.filtersBlock?.dataset.state !== 'exercises') return;
  if (!refs.form) return;

  const categoryInput = refs.form.elements.namedItem(
    'category'
  ) as HTMLInputElement | null;

  const filterInput = refs.form.elements.namedItem(
    'filter'
  ) as HTMLInputElement | null;

  const searchInput = refs.form.elements.namedItem(
    'search'
  ) as HTMLInputElement | null;

  const category = categoryInput?.value.trim();
  const filter = filterInput?.value;
  const keyword = searchInput?.value.trim();

  if (!category) return;

  if (
    filter !== Filter.Muscles &&
    filter !== Filter.BodyParts &&
    filter !== Filter.Equipment
  ) {
    return;
  }

  await loadExercises({
    category,
    filter,
    keyword: keyword || undefined,
    page: 1,
    limit: exercisesLimit(),
  });
}

async function handleFormSubmit(event: Event) {
  event.preventDefault();

  await searchExercises();
}

const homeButton =
  document.querySelector<HTMLButtonElement>('.filters-block-home');

homeButton?.addEventListener('click', () => {
  setCurrentFilter(Filter.Muscles);
  setFilterInputValue(Filter.Muscles);

  void renderCategories(
    Filter.Muscles,
    1,
    categoriesLimit()
  );
});

const searchField =
  document.querySelector<HTMLInputElement>(
    '.filters-block-search-input'
  );

searchField?.addEventListener('input', () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    void searchExercises();
  }, 300);
});

refs.form?.addEventListener('submit', handleFormSubmit);
refs.filtersBlockList?.addEventListener('click', handleFilterClick);