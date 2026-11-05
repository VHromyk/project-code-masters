import { getCategories } from './category-api';
import { categoriesListTpl } from './templates/category-card';
import { cardLimit } from './utils/card-limit';

const section = document.querySelector<HTMLElement>('.categories');

const list =
  section?.querySelector<HTMLUListElement>('.js-categories-list');

const status =
  section?.querySelector<HTMLElement>('.categories-status');

const pagination =
  section?.querySelector<HTMLElement>('.categories-pagination');

const content =
  section?.querySelector<HTMLElement>('.categories-content');

const exercisesSection =
  document.querySelector<HTMLElement>('#exercises');

const filtersBlock =
  document.querySelector<HTMLElement>('.filters-block');

const filterInput =
  document.querySelector<HTMLInputElement>(
    '.filters-block-filter-input'
  );

const categoryInput =
  document.querySelector<HTMLInputElement>(
    '.filters-block-category-input'
  );

const searchInput =
  document.querySelector<HTMLInputElement>(
    '.filters-block-search-input'
  );

const subheader =
  document.querySelector<HTMLElement>('.filters-block-subheader');

let currentFilter = 'Muscles';
let currentPage = 1;
let requestId = 0;

export const categoriesLimit = (): number =>
  cardLimit({
    mobileLimit: 9,
    desktopLimit: 12,
  });

export async function renderCategories(
  filter: string = currentFilter,
  page: number = currentPage,
  limit: number = categoriesLimit()
): Promise<void> {
  if (!list || !status || !pagination) return;

  currentFilter = filter;
  currentPage = page;

  const currentRequest = ++requestId;

  // Повертаємо панель у режим категорій.
  if (filtersBlock) {
    filtersBlock.dataset.state = 'categories';
  }

  if (filterInput) filterInput.value = filter;
  if (categoryInput) categoryInput.value = '';
  if (searchInput) searchInput.value = '';
  if (subheader) subheader.textContent = '';

  if (exercisesSection) exercisesSection.hidden = true;

  if (section) section.hidden = false;
  if (content) content.hidden = false;

  list.hidden = false;
  list.style.removeProperty('display');

  // Синхронізуємо активну кнопку нової панелі.
  document
    .querySelectorAll<HTMLButtonElement>(
      '.filters-block-list-button'
    )
    .forEach(button => {
      const active = button.dataset.filter === filter;

      button.classList.toggle('current', active);
      button.setAttribute('aria-pressed', String(active));
    });

  // Зберігаємо висоту тільки на час завантаження.
  list.style.minHeight =
    `${list.getBoundingClientRect().height}px`;

  list.setAttribute('aria-busy', 'true');

  pagination.replaceChildren();
  pagination.hidden = true;

  status.textContent = 'Loading categories…';
  status.hidden = list.children.length > 0;

  try {
    const { results, totalPages } = await getCategories(
      filter,
      page,
      limit
    );

    if (currentRequest !== requestId) return;

    if (results.length === 0) {
      list.replaceChildren();
      list.style.removeProperty('min-height');

      status.textContent =
        'No categories found. Please try another filter.';
      status.hidden = false;

      return;
    }

    list.innerHTML = categoriesListTpl(results);
    list.style.removeProperty('min-height');

    status.hidden = true;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!reducedMotion) {
      list.animate(
        [
          { opacity: 0.35, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 220,
          easing: 'ease-out',
        }
      );
    }

    if (totalPages > 1) {
      const fragment = document.createDocumentFragment();

      for (let number = 1; number <= totalPages; number += 1) {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'categories-page';
        button.dataset.page = String(number);
        button.textContent = String(number);

        button.setAttribute('aria-label', `Page ${number}`);

        if (number === page) {
          button.setAttribute('aria-current', 'page');
        }

        fragment.append(button);
      }

      pagination.append(fragment);
      pagination.hidden = false;
    }
  } catch {
    if (currentRequest !== requestId) return;

    list.replaceChildren();
    list.style.removeProperty('min-height');

    status.textContent = 'Could not load categories. ';
    status.hidden = false;

    const retry = document.createElement('button');

    retry.type = 'button';
    retry.className = 'categories-retry';
    retry.textContent = 'Try again';

    retry.addEventListener('click', () => {
      void renderCategories();
    });

    status.append(retry);
  } finally {
    if (currentRequest === requestId) {
      list.setAttribute('aria-busy', 'false');
    }
  }
}

// Серверна пагінація категорій.
pagination?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;

  const button =
    event.target.closest<HTMLButtonElement>('button[data-page]');

  if (!button || button.hasAttribute('aria-current')) return;

  void renderCategories(
    currentFilter,
    Number(button.dataset.page),
    categoriesLimit()
  );
});

// Зміна кількості карток при переході між mobile і tablet.
window.matchMedia('(max-width: 767px)')
  .addEventListener('change', () => {
    // Не повертаємо користувача до категорій,
    // якщо він зараз переглядає вправи.
    if (filtersBlock?.dataset.state === 'exercises') return;

    list?.style.removeProperty('min-height');

    void renderCategories(
      currentFilter,
      1,
      categoriesLimit()
    );
  });

// Початковий фільтр — Muscles.
void renderCategories('Muscles', 1, categoriesLimit());