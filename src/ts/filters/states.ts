import { refs } from './refs'
import type { Filter } from '../types/filter';

export function changeFiltersState() {
  const { filtersBlock } = refs;
  if (filtersBlock) {
    filtersBlock.dataset.state = 'exercises';
  }
};

export function changeFiltersStateToCategories() {
  const { filtersBlock } = refs;
  if (filtersBlock) {
    filtersBlock.dataset.state = 'categories';
  }
};

export function updateCategoryName(name: string) {
  const { subheader, categoryInput } = refs;
  if (subheader) {
    subheader.textContent = name;
  }
  if (categoryInput) {
    categoryInput.value = name;
  }
}

export function updateCloseButtonHiding() {
  if (refs.searchInput?.value) {
    refs.closeButton?.classList.remove('hide');
  } else {
    refs.closeButton?.classList.add('hide');
  }
}

export function setCurrentFilter(filter: Filter) {
  refs.filtersBlockButtons.forEach(button => {
    if (button.dataset.filter === filter) {
      button.classList.add('current');
    } else {
      button.classList.remove('current');
    }
  });

  if (refs.filterHideInput) {
    refs.filterHideInput.value = filter;
  }
}

