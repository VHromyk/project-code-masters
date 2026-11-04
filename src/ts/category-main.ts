import { getCategories } from './category-api';
import { categoriesListTpl } from './templates/category-card';

const list = document.querySelector<HTMLUListElement>('.js-categories-list');

function showError(list: HTMLUListElement, message: string): void {
  list.innerHTML = `<li class="categories-error">${message}</li>`;
}

async function renderCategories(
  filter: string,
  page: number,
  limit: number
): Promise<void> {
  if (!list) return;

  try {
    const { results } = await getCategories(filter, page, limit);
    if (results.length === 0) {
      showError(
        list,
        `No categories found for filter: ${filter} on page ${page}`
      );
      return;
    }
    list.innerHTML = categoriesListTpl(results);
  } catch (error) {
    showError(list, 'Could not load categories');
  }
}

const isMobile = false;
let limit = 12;
if (isMobile) {
  limit = 9;
}

renderCategories('Muscles', 1, limit);
