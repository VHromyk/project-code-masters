import type { Category } from '../types/category';
import { escapeHtml } from '../utils/escape-html';

export const categoryCardTemplate = (category: Category): string => `
  <li class="category-card"
      style="background-image: linear-gradient(rgba(17, 17, 17, 0.5), rgba(17, 17, 17, 0.5)), url('${encodeURI(category.imgURL)}')">
    <button class="category-card-btn" type="button"
            data-filter="${escapeHtml(category.filter)}" data-name="${escapeHtml(category.name)}">
      <h3 class="category-card-title">${escapeHtml(category.name)}</h3>
      <p class="category-card-filter">${escapeHtml(category.filter)}</p>
    </button>
  </li>`;

export const categoriesListTpl = (categories: Category[]): string =>
  categories.map(categoryCardTemplate).join('');
