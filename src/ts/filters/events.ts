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
  if (refs.filtersBlock?.dataset.state === 'exercises') {
    return;
  }

  const { target } = event;
  if (target instanceof HTMLElement === false || target?.nodeName !== 'SPAN') {
    return;
  }

  const button = target.parentElement;
  if (!button) {
    console.error('Button not found');
    return;
  }
  const filter = button.dataset.filter as Filter;

  setCurrentFilter(filter);
  setFilterInputValue(filter);

  const limit = categoriesLimit();
  await renderCategories(filter, 1, limit);
}

async function handleFormSubmit(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const category = (form.elements.namedItem('category') as HTMLInputElement)?.value;
  const filter = (form.elements.namedItem('filter') as HTMLInputElement)?.value as Filter;
  const keyword = (form.elements.namedItem('search') as HTMLInputElement)?.value;
  const limit = exercisesLimit();
  await loadExercises({ category, filter, keyword, page: 1, limit });
}

refs.form?.addEventListener('submit', handleFormSubmit);
refs.filtersBlockList?.addEventListener('click', handleFilterClick);