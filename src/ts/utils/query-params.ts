import type { FilterName } from '../types/exercise';

export type ExercisesQuery = {
  filter: FilterName;
  category: string;
  page: number;
  keyword?: string;
};

export type CategoriesQuery = {
  filter: FilterName;
  page: number;
};

const FILTERS: FilterName[] = ['Muscles', 'Body parts', 'Equipment'];

export function isFilterName(value: string | null | undefined): value is FilterName {
  return FILTERS.includes(value as FilterName);
}

function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function readExercisesQuery(): ExercisesQuery | null {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category')?.trim();
  if (!category) return null;

  const filterParam = params.get('filter');
  const filter = isFilterName(filterParam) ? filterParam : 'Muscles';
  const keyword = params.get('keyword')?.trim() || undefined;

  return {
    filter,
    category,
    page: parsePage(params.get('page')),
    keyword,
  };
}

export function readCategoriesQuery(): CategoriesQuery {
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('filter');

  return {
    filter: isFilterName(filterParam) ? filterParam : 'Muscles',
    page: parsePage(params.get('page')),
  };
}

export function writeExercisesQuery({
  filter,
  category,
  page,
  keyword,
}: ExercisesQuery): void {
  const url = new URL(window.location.href);
  url.searchParams.set('filter', filter);
  url.searchParams.set('category', category);
  url.searchParams.set('page', String(page));

  if (keyword) {
    url.searchParams.set('keyword', keyword);
  } else {
    url.searchParams.delete('keyword');
  }

  history.replaceState(null, '', url);
}

export function writeCategoriesQuery({ filter, page }: CategoriesQuery): void {
  const url = new URL(window.location.href);
  url.searchParams.set('filter', filter);
  url.searchParams.set('page', String(page));
  url.searchParams.delete('category');
  url.searchParams.delete('keyword');
  history.replaceState(null, '', url);
}
