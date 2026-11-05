import { getCategories } from './category-api';
import { categoriesListTpl } from './templates/category-card';

type Filter = 'Muscles' | 'Body parts' | 'Equipment';

const section = document.querySelector<HTMLElement>('.categories');

const list =
  section?.querySelector<HTMLUListElement>('.js-categories-list');

const status =
  section?.querySelector<HTMLElement>('.categories-status');

const pagination =
  section?.querySelector<HTMLElement>('.categories-pagination');

const filters =
  section?.querySelectorAll<HTMLButtonElement>('.categories-filter');

const content =
  section?.querySelector<HTMLElement>('.categories-content');

const home =
  section?.querySelector<HTMLButtonElement>('.categories-home');

const breadcrumb =
  section?.querySelector<HTMLElement>('.categories-breadcrumb');

const searchForm =
  section?.querySelector<HTMLFormElement>('.categories-search');

const searchInput =
  section?.querySelector<HTMLInputElement>('.categories-search-input');

const exercisesSection =
  document.querySelector<HTMLElement>('#exercises');

const mobile = window.matchMedia('(max-width: 767px)');

let filter: Filter = 'Muscles';
let page = 1;

// Допомагає ігнорувати відповіді від попередніх запитів.
let requestId = 0;

async function renderCategories(): Promise<void> {
  if (!list || !status || !pagination) return;

  // Повертаємо відображення категорій.
  if (exercisesSection) exercisesSection.hidden = true;
  if (content) content.hidden = false;
  if (breadcrumb) breadcrumb.hidden = true;
  if (searchForm) searchForm.hidden = true;
  if (searchInput) searchInput.value = '';

  list.style.removeProperty('display');

  const currentRequest = ++requestId;
  const limit = mobile.matches ? 9 : 12;

  list.style.minHeight = `${list.getBoundingClientRect().height}px`;
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

    // Користувач міг уже вибрати інший фільтр.
    if (currentRequest !== requestId) return;

    if (results.length === 0) {
      list.replaceChildren();
      list.style.removeProperty('min-height');

      status.textContent =
        'No categories found. Please try another filter.';
      return;
    }

    list.innerHTML = categoriesListTpl(results);
    list.style.removeProperty('min-height');
    status.hidden = true;

    list.animate(
      [
        { opacity: 0.35, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 0
          : 220,
        easing: 'ease-out',
      }
    );

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

// Перемикання фільтрів.
filters?.forEach(button => {
  button.addEventListener('click', () => {
    const nextFilter = button.dataset.filter as Filter;

    if (nextFilter === filter && !content?.hidden) return;

    filter = nextFilter;
    page = 1;

    filters.forEach(item => {
      const active = item === button;

      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    void renderCategories();
  });
});

// Перемикання сторінок.
pagination?.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;

  const button =
    event.target.closest<HTMLButtonElement>('button[data-page]');

  if (!button || button.hasAttribute('aria-current')) return;

  page = Number(button.dataset.page);

  void renderCategories();
});

// Якщо змінилася кількість карток на сторінці,
// завантажуємо першу сторінку з новим limit.
mobile.addEventListener('change', () => {
  list?.style.removeProperty('min-height');
  page = 1;

  void renderCategories();
});

home?.addEventListener('click', () => {
  if (content?.hidden) {
    void renderCategories();
  }
});

// Початкове завантаження Muscles.
void renderCategories();
