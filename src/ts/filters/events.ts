import { Filter } from '../types/filter';
import { renderCategories } from '../category-main';
import { exercisesLimit, loadExercises } from '../exercises/exercises-page';
import { categoriesLimit } from '../category-main';
import {
  updateCloseButtonHiding,
  setCurrentFilter,
  changeFiltersStateToCategories
} from './states';
import { refs } from './refs';

let currentFilter = Filter.Muscles

async function renderExercisesByFormData(form: HTMLFormElement) {
  const category = (form.elements.namedItem('category') as HTMLInputElement)?.value;
  const filter = (form.elements.namedItem('filter') as HTMLInputElement)?.value as Filter;
  const keyword = (form.elements.namedItem('search') as HTMLInputElement)?.value.trim();
  const limit = exercisesLimit();
  await loadExercises({ category, filter, keyword, page: 1, limit });
}

async function renderCategoriesByFilter() { 
  const limit = categoriesLimit();
  await renderCategories(currentFilter, 1, limit);
}

async function handleFilterClick(event: Event) {
  const target = event.target as HTMLElement;
  if (target?.nodeName !== 'SPAN') {
    return;
  }

  currentFilter = target.parentElement?.dataset.filter as Filter;
  setCurrentFilter(currentFilter);

  changeFiltersStateToCategories();
  await renderCategoriesByFilter()
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

async function handleExercisesLinkClick() { 
  changeFiltersStateToCategories()
  await renderCategoriesByFilter()
}

refs.form?.addEventListener('submit', handleFormSubmit);
refs.filtersBlockList?.addEventListener('click', handleFilterClick);
refs.closeButton?.addEventListener('click', handleCloseButtonClick);
refs.searchInput?.addEventListener('input', handleSearchInputValueChange);
refs.exercisesLink?.addEventListener('click', handleExercisesLinkClick)