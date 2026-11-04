import type { IChangeFiltersState } from './types';

const refs = {
  exersisesPageElements: document.querySelectorAll<HTMLElement>('.exersises-page-elements')
};

export const changeFiltersState: IChangeFiltersState = () => {
  const elems = refs.exersisesPageElements;
  elems.forEach(elem => {
    if (elem.style.display === 'none') {
      elem.style.display = 'block';
    } else {
      elem.style.display = 'none';
    }
  });
};
