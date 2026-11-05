import { Filter } from '../types/filter';
import { renderCategories } from '../category-main';
import { exercisesLimit, loadExercises } from '../exercises/exercises-page';
import { categoriesLimit } from '../category-main';

const refs = {
  filtersBlock: document.querySelector<HTMLElement>('.filters-block'),
  filtersBlockList: document.querySelector<HTMLElement>('.filters-block-list'),
  filtersBlockButtons: document.querySelectorAll<HTMLElement>('.filters-block-list-button'),
  filterInput: document.querySelector<HTMLInputElement>('.filters-block-filter-input'),
  searchInput: document.querySelector<HTMLInputElement>('.filters-block-search-input'),
  form: document.querySelector<HTMLFormElement>('.filters-block-form'),
  closeButton: document.querySelector<HTMLElement>('.filters-block-search-close-button')
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

  if (refs.filterInput) {
    refs.filterInput.value = filter;
  }
}

async function renderExercisesByFormData(form: HTMLFormElement) {
  const category = (form.elements.namedItem('category') as HTMLInputElement)?.value;
  const filter = (form.elements.namedItem('filter') as HTMLInputElement)?.value as Filter;
  const keyword = (form.elements.namedItem('search') as HTMLInputElement)?.value;
  const limit = exercisesLimit();
  await loadExercises({ category, filter, keyword, page: 1, limit });
}

function updateCloseButtonHiding() {
  if (refs.searchInput?.value) {
    refs.closeButton?.classList.remove('hide');
  } else {
    refs.closeButton?.classList.add('hide');
  }
}

async function handleFilterClick(event: Event) {
  if (!(event.target instanceof Element)) return;

  const target = event.target as HTMLElement;
  if (target?.nodeName !== 'SPAN') {
    return;
  }

  const filter = target.parentElement?.dataset.filter as Filter;
  setCurrentFilter(filter);

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

  const form = event.target as HTMLFormElement;
  await renderExercisesByFormData(form);
}

async function handleCloseButtonClick() {
  const searchInput = refs.form?.elements.namedItem('search') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }
  updateCloseButtonHiding();

  await renderExercisesByFormData(refs.form!);
}

function handleSearchInputValueChange() {
  updateCloseButtonHiding();
}

refs.form?.addEventListener('submit', handleFormSubmit);
refs.filtersBlockList?.addEventListener('click', handleFilterClick);
refs.closeButton?.addEventListener('click', handleCloseButtonClick);
refs.searchInput?.addEventListener('input', handleSearchInputValueChange);