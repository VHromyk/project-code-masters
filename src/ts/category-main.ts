import { getCategories } from './category-api';
import { categoriesListTpl } from './templates/category-card';
import { cardLimit } from './utils/card-limit';

const list = document.querySelector<HTMLUListElement>('.js-categories-list');

function showError(list: HTMLUListElement, message: string): void {
  list.innerHTML = `<li class="categories-error">${message}</li>`;
}

export const categoriesLimit = (): number =>
  cardLimit({ mobileLimit: 9, desktopLimit: 12 });

export async function renderCategories(
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

const limit = categoriesLimit();

renderCategories('Muscles', 1, limit);
