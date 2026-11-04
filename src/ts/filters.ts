import { makeCategoriesBlock } from './categories';
import { Filter } from './types';
import { getCategories } from './api';

const refs = {
  filtersBlockList: document.querySelector('.filters-block-list'),
  filtersBlockButtons: document.querySelectorAll('.filters-block-list-button')
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

async function handleFilterClick(event: Event) {
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

  const data = await getCategories(filter, 1, 10);
  makeCategoriesBlock(data);
}

setCurrentFilter(Filter.Muscles);
getCategories(Filter.Muscles, 1, 10).then(data => makeCategoriesBlock(data));
refs.filtersBlockList?.addEventListener('click', handleFilterClick);