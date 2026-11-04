import type { CategoriesResponse } from './category-types';

const BASE_URL = 'https://your-energy.b.goit.study/api';

export async function getCategories(
  filter: string,
  page: number = 1,
  limit: number = 12
): Promise<CategoriesResponse> {
  const params = new URLSearchParams({
    filter,
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${BASE_URL}/filters?${params}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
