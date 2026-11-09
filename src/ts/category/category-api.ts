import type { CategoriesResponse } from '../types/category';
import http from '../../api/http';
import { API_URL } from '../../api/config/endpoints';

export async function getCategories(
  filter: string,
  page: number = 1,
  limit: number = 12
): Promise<CategoriesResponse> {
  const { data } = await http.get<CategoriesResponse>(API_URL.filters, {
    params: { filter, page, limit },
  });
  return data;
}
